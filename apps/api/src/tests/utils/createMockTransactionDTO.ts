import { faker } from '@faker-js/faker/.';

export function createMockTransactionDTO() {
    return {
        bookId: faker.string.uuid(),
        userId: faker.string.uuid(),
    };
}
