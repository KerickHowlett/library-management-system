import { Test, TestingModule } from '@nestjs/testing';
import { TransactionAction } from '@prisma/client';
import { faker } from '@faker-js/faker';

import { LibraryActionDTO } from './dto/library-action.dto';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './services/transactions.service';

import { createMockLibraryActionDTO, createMockTransactionDTO } from '../tests/utils';

class MockTransactionsService {
    async findAll() {
        return [
            {
                id: faker.string.uuid(),
                ...createMockTransactionDTO(),
            },
        ];
    }

    async findOne(id: string) {
        return { id, ...createMockTransactionDTO() };
    }

    async checkoutBook(dto: LibraryActionDTO) {
        return {
            ...dto,
            id: faker.string.uuid(),
            action: TransactionAction.CheckedOut,
        };
    }

    async returnBook(dto: LibraryActionDTO) {
        return {
            ...dto,
            id: faker.string.uuid(),
            action: TransactionAction.Returned,
        };
    }
}

describe('TransactionsController', () => {
    let controller: TransactionsController;
    let mockTransactionsService: MockTransactionsService;

    beforeEach(async () => {
        mockTransactionsService = new MockTransactionsService();

        const module: TestingModule = await Test.createTestingModule({
            controllers: [TransactionsController],
            providers: [
                {
                    provide: TransactionsService,
                    useValue: mockTransactionsService,
                },
            ],
        }).compile();

        controller = module.get<TransactionsController>(TransactionsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should return all transactions', async () => {
        const transactions = await controller.getAllTransactions();
        expect(transactions.length).toEqual(1);
    });

    it('should return a single transaction by ID', async () => {
        const id = faker.string.uuid();
        const transaction = await controller.getTransactionById(id);

        expect(transaction.id).toEqual(id);
    });

    it('should create a checkout transaction', async () => {
        const dto = createMockLibraryActionDTO();
        const transaction = await controller.createCheckoutTransaction(dto);

        expect(transaction).toMatchObject({ ...dto, action: TransactionAction.CheckedOut });
    });

    it('should create a return transaction', async () => {
        const dto = createMockLibraryActionDTO();
        const transaction = await controller.createReturnTransaction(dto);

        expect(transaction).toMatchObject({ ...dto, action: TransactionAction.Returned });
    });
});
