import { Test, TestingModule } from '@nestjs/testing';
import type { Transaction } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { TransactionAction } from '@prisma/client';

import { CreateTransactionDTO } from '../dto';
import { TransactionsService } from './transactions.service';
import { TRANSACTION_REPOSITORY } from '../repositories/transactions.repository';
import { createMockLibraryActionDTO, createMockTransactionDTO } from '../../tests/utils';

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

    it('should checkout a book', async () => {
        const dto = createMockLibraryActionDTO();
        const transaction = await service.checkoutBook(dto);

        expect(transaction).toMatchObject({
            ...dto,
            action: TransactionAction.CheckedOut,
        });
    });

    it('should return a book', async () => {
        const dto = createMockLibraryActionDTO();
        const transaction = await service.returnBook(dto);

        expect(transaction).toMatchObject({
            ...dto,
            action: TransactionAction.Returned,
        });
    });

    it('should find all transactions', async () => {
        const transactions = [createMockTransactionDTO(), createMockTransactionDTO()];
        for (const transaction of transactions) {
            await service.checkoutBook(transaction);
        }

        const foundTransactions = await service.findAll();
        expect(foundTransactions).toHaveLength(transactions.length);
    });

    it('should find a transaction by id', async () => {
        const dto = createMockLibraryActionDTO();
        const transaction = await service.checkoutBook(dto);
        const foundTransaction = await service.findOne(transaction.id);

        expect(foundTransaction).toEqual(transaction);
    });
});
