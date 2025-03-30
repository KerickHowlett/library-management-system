import { faker } from '@faker-js/faker';
import type { Prisma } from '@prisma/client';

export const createUserFixture = (): Prisma.UserCreateInput => ({
    fullName: faker.person.fullName(),
    email: faker.internet.email(),
});
