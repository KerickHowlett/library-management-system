import { faker } from '@faker-js/faker';
import type { Prisma } from '@prisma/client';

export const createBookFixture = (): Prisma.BookCreateInput => ({
    author: faker.book.author(),
    edition: faker.datatype.boolean() ? faker.number.int({ min: 1, max: 20 }).toString() : null,
    genre: faker.book.genre(),
    publisher: faker.book.publisher(),
    series: faker.datatype.boolean() ? faker.book.series() : null,
    title: faker.book.title(),
});
