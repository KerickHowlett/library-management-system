import { Test, TestingModule } from '@nestjs/testing';
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { type User, type Book, TransactionAction } from '@prisma/client';
import { execSync } from 'child_process';
import range from 'lodash/range';
import path from 'path';

import { createBookFixture, createTransactionFixture, createUserFixture } from '../../tests/utils';
import { TransactionsPrismaRepository } from './transactions.prisma.repository';
import { PrismaService } from '../../prisma/prisma.service';

describe('TransactionsPrismaRepository', () => {
    let users: User[] = [];
    let books: Book[] = [];
    let prisma: PrismaService;
    let container: StartedPostgreSqlContainer;
    let repository: TransactionsPrismaRepository;

    beforeAll(async () => {
        container = await new PostgreSqlContainer().start();

        const DB_ENV = {
            POSTGRES_HOST: container.getHost(),
            POSTGRES_PASSWORD: container.getPassword(),
            POSTGRES_USER: container.getUsername(),
            POSTGRES_DB: container.getName(),
            POSTGRES_PORT: container.getPort().toString(),
        } as const;

        const DATABASE_URL = `postgresql://${DB_ENV.POSTGRES_USER}:${DB_ENV.POSTGRES_PASSWORD}@${DB_ENV.POSTGRES_HOST}:${DB_ENV.POSTGRES_PORT}/${DB_ENV.POSTGRES_DB}?schema=public`;
        process.env.DATABASE_URL = DATABASE_URL;

        execSync('npx prisma migrate dev', {
            env: { ...process.env, ...DB_ENV, DATABASE_URL },
            cwd: path.resolve(__dirname, '../../../../..'),
        });

        const module: TestingModule = await Test.createTestingModule({
            providers: [TransactionsPrismaRepository, PrismaService],
        }).compile();

        prisma = module.get<PrismaService>(PrismaService);
        repository = module.get<TransactionsPrismaRepository>(TransactionsPrismaRepository);

        [books, users] = await prisma.$transaction([
            prisma.book.createManyAndReturn({ data: range(2).map(createBookFixture) }),
            prisma.user.createManyAndReturn({ data: range(2).map(createUserFixture) }),
        ]);
    });

    afterAll(async () => {
        users = [];
        books = [];
        await container.stop();
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    describe('creating a transaction', () => {
        it('should create a checkout transaction', async () => {
            const transactionData = createTransactionFixture(books, users);
            const createdTransaction = await repository.create(transactionData);

            expect(createdTransaction).toMatchObject(transactionData);
        });

        it('should assign a user id to a book when book is checked out', async () => {
            const transactionData = createTransactionFixture(books, users);
            transactionData.action = TransactionAction.CheckedOut;

            await repository.create(transactionData);
            const book = await prisma.book.findUnique({ where: { id: transactionData.bookId } });

            expect(book.userId).toEqual(transactionData.userId);
        });

        it('should set user id as null when book is returned', async () => {
            const transactionData = createTransactionFixture(books, users);

            transactionData.action = TransactionAction.CheckedOut;
            await repository.create(transactionData);

            transactionData.action = TransactionAction.Returned;
            await repository.create(transactionData);

            const book = await prisma.book.findUnique({ where: { id: transactionData.bookId } });
            expect(book.userId).toBeNull();
        });
    });

    it('should find a transaction by ID', async () => {
        const transactionData = createTransactionFixture(books, users);
        const createdTransaction = await repository.create(transactionData);

        const foundTransaction = await repository.findById(createdTransaction.id);
        expect(foundTransaction).toMatchObject(createdTransaction);
    });

    it('should find all transactions', async () => {
        const transactions = range(2).map(() => createTransactionFixture(books, users));
        await Promise.all([repository.create(transactions[0]), repository.create(transactions[1])]);

        const foundTransactions = await repository.findAll();
        expect(foundTransactions.length).toBeGreaterThanOrEqual(transactions.length);

        const matchingTransactions = foundTransactions.filter((foundTransaction) =>
            transactions.some(
                (transaction) =>
                    transaction.userId === foundTransaction.userId &&
                    transaction.bookId === foundTransaction.bookId,
            ),
        );
        expect(foundTransactions).toEqual(expect.arrayContaining(matchingTransactions));
    });
});
