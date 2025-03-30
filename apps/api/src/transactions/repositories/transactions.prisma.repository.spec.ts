import { Test, TestingModule } from '@nestjs/testing';
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import type { User, Book } from '@prisma/client';
import { execSync } from 'child_process';
import range from 'lodash/range';
import path from 'path';

import { createBookFixture, createTransactionFixture, createUserFixture } from '../../tests/utils';
import { TransactionsPrismaRepository } from './transactions.prisma.repository';
import { PrismaService } from '../../prisma/prisma.service';

describe('TransactionsPrismaRepository', () => {
    let users: User[] = [];
    let books: Book[] = [];
    let container: StartedPostgreSqlContainer;
    let repository: TransactionsPrismaRepository;

    jest.setTimeout(10_000);
    beforeEach(async () => {
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

        repository = module.get<TransactionsPrismaRepository>(TransactionsPrismaRepository);

        const prisma = module.get<PrismaService>(PrismaService);
        [books, users] = await prisma.$transaction([
            prisma.book.createManyAndReturn({ data: range(2).map(createBookFixture) }),
            prisma.user.createManyAndReturn({ data: range(2).map(createUserFixture) }),
        ]);
    });

    afterEach(async () => {
        users = [];
        books = [];
        await container.stop({
            remove: true,
            removeVolumes: true,
        });
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    it('should create a transaction', async () => {
        const transactionData = createTransactionFixture(books, users);
        const createdTransaction = await repository.create(transactionData);

        expect(createdTransaction).toMatchObject(transactionData);
    });

    it('should find a transaction by ID', async () => {
        const transactionData = createTransactionFixture(books, users);
        const createdTransaction = await repository.create(transactionData);

        const foundTransaction = await repository.findById(createdTransaction.id);
        expect(foundTransaction).toMatchObject(createdTransaction);
    });

    it('should find all transactions', async () => {
        const transaction1 = createTransactionFixture(books, users);
        await repository.create(transaction1);

        const transaction2 = createTransactionFixture(books, users);
        await repository.create(transaction2);

        const transactions = await repository.findAll();
        expect(transactions).toHaveLength(2);
        expect(transactions).toEqual(
            expect.arrayContaining([
                expect.objectContaining(transaction1),
                expect.objectContaining(transaction2),
            ]),
        );
    });
});
