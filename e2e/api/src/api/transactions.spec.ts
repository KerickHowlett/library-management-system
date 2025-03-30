import { HttpStatus } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import {
    PrismaClient,
    type Transaction,
    TransactionAction,
    type Book,
    type User,
    type Prisma,
} from '@prisma/client';
import axios from 'axios';
import type { DefaultArgs } from '@prisma/client/runtime/library';

function createLibraryActionDTO(
    bookIds: Book['id'][],
    userIds: User['id'][],
): Partial<Transaction> {
    return {
        bookId: faker.helpers.arrayElement(bookIds),
        userId: faker.helpers.arrayElement(userIds),
    };
}

describe('Transactions API', () => {
    let userIds: User['id'][] = [];
    let bookIds: Book['id'][] = [];
    let prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;

    beforeEach(async () => {
        userIds = [];
        bookIds = [];

        prisma = new PrismaClient();
        const [users, books] = await prisma.$transaction([
            prisma.user.createManyAndReturn({
                data: Array.from({ length: 3 }).map(() => ({
                    email: faker.internet.email(),
                    fullName: faker.person.fullName(),
                })),
            }),
            prisma.book.createManyAndReturn({
                data: Array.from({ length: 5 }).map(() => ({
                    title: faker.lorem.words(3),
                    edition: faker.string.alpha(5),
                    author: faker.person.fullName(),
                    genre: faker.lorem.word(),
                    publisher: faker.company.name(),
                })),
            }),
        ]);

        userIds = users.map(({ id }) => id);
        bookIds = books.map(({ id }) => id);
    });

    afterEach(async () => {
        userIds = [];
        bookIds = [];
        await prisma.$disconnect();
    });

    describe('/api/transactions', () => {
        it('GET > should get all transactions', async () => {
            const { data: transactions, status } = await axios.get(`/api/transactions`);

            expect(status).toEqual(HttpStatus.OK);
            expect(transactions).toBeInstanceOf(Array);
        });

        it('GET > should find transaction by id', async () => {
            const dto = createLibraryActionDTO(bookIds, userIds);
            const { data: createdTransaction } = await axios.post(`/api/checkout`, dto);

            const { data: transaction, status } = await axios.get(
                `/api/transactions/${createdTransaction.id}`,
            );

            expect(status).toEqual(HttpStatus.OK);
            expect(transaction).toMatchObject(createdTransaction);
        });
    });

    describe('/api/checkout', () => {
        it('POST > should create a checkout transaction', async () => {
            const dto = createLibraryActionDTO(bookIds, userIds);
            const { data: transaction, status } = await axios.post(`/api/checkout`, dto);

            expect(status).toEqual(HttpStatus.CREATED);
            expect(transaction).toMatchObject({
                ...dto,
                id: expect.any(String),
                action: TransactionAction.CheckedOut,
            });

            const { data: book } = await axios.get<Book>(`/api/books/${dto.bookId}`);
            expect(book.userId).toEqual(dto.userId);
        });
    });

    describe('/api/return', () => {
        it('POST > should create a return transaction', async () => {
            const dto = createLibraryActionDTO(bookIds, userIds);
            await axios.post(`/api/checkout`, dto);

            const { data: transaction, status } = await axios.post(`/api/return`, dto);

            expect(status).toEqual(HttpStatus.CREATED);
            expect(transaction).toMatchObject({
                ...dto,
                id: expect.any(String),
                action: TransactionAction.Returned,
            });

            const { data: book } = await axios.get<Book>(`/api/books/${dto.bookId}`);
            expect(book.userId).toBeNull();
        });
    });
});
