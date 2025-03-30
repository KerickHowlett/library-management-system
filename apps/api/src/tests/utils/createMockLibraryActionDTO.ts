import { faker } from '@faker-js/faker';

export function createMockLibraryActionDTO() {
    return {
        userId: faker.string.uuid(),
        bookId: faker.string.uuid(),
    };
}
