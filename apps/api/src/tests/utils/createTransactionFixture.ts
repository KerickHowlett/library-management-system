import { faker } from '@faker-js/faker';
import { type Book, type User, TransactionAction } from '@prisma/client';

export function createTransactionFixture(books: Book[], users: User[]) {
    return {
        action: faker.helpers.enumValue(TransactionAction),
        bookId: faker.helpers.arrayElement(books).id,
        userId: faker.helpers.arrayElement(users).id,
    };
}
