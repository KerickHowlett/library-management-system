import type { Book, User } from '@prisma/client';

import { createBookFixture } from './createBookFixture';
import { createTransactionFixture } from './createTransactionFixture';
import { createUserFixture } from './createUserFixture';

export function createMockTransactionDTO() {
    return createTransactionFixture([createBookFixture() as Book], [createUserFixture() as User]);
}
