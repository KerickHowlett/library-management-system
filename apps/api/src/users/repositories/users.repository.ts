import type { User } from '@prisma/client';

import type { CreateUserDto } from '../dto/create-user.dto';

export const USER_REPOSITORY = 'USER_REPOSITORY' as const;

export interface UsersRepository {
    findAll(): Promise<User[]>;
    findById(id: User['id']): Promise<User | null>;
    create(user: CreateUserDto): Promise<User>;
    update(id: User['id'], user: Partial<User>): Promise<User | null>;
    delete(id: User['id']): Promise<boolean>;
}
