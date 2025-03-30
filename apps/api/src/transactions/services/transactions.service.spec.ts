import { Test, TestingModule } from '@nestjs/testing';
import type { Transaction } from '@prisma/client';
import { faker } from '@faker-js/faker';

import { CreateTransactionDTO } from '../dto';
import { TransactionsService } from './transactions.service';
import { createMockTransactionDTO } from '../../tests/utils';
import { TRANSACTION_REPOSITORY } from '../repositories/transactions.repository';

class MockTransactionsRepository {
    private transactions = new Map<Transaction['id'], Transaction>();

    async create(dto: CreateTransactionDTO) {
        const id = faker.string.uuid();
        const transaction = { id, timestamp: new Date(), ...dto } as Transaction;
        this.transactions.set(id, transaction);

        return transaction;
    }

    async findAll() {
        return Array.from(this.transactions.values());
    }

    async findById(id: Transaction['id']) {
        return this.transactions.get(id) || null;
    }
}

describe('TransactionsService', () => {
    let service: TransactionsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TransactionsService,
                { provide: TRANSACTION_REPOSITORY, useClass: MockTransactionsRepository },
            ],
        }).compile();

        service = module.get<TransactionsService>(TransactionsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a transaction', async () => {
        const dto = createMockTransactionDTO();
        const transaction = await service.create(dto);

        expect(transaction).toMatchObject(dto);
    });

    it('should find all transactions', async () => {
        const transactions = [createMockTransactionDTO(), createMockTransactionDTO()];
        transactions.forEach(
            async (transaction: CreateTransactionDTO) => await service.create(transaction),
        );

        const foundTransactions = await service.findAll();

        expect(foundTransactions).toMatchObject(transactions);
        expect(transactions).toHaveLength(transactions.length);
        expect(transactions).toEqual(expect.arrayContaining(transactions));
    });

    it('should find a transaction by id', async () => {
        const transaction = await service.create(createMockTransactionDTO());
        const foundTransaction = await service.findOne(transaction.id);

        expect(foundTransaction).toEqual(transaction);
    });
});
