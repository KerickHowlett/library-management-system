import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { faker } from '@faker-js/faker';

import { CreateUserDto, UpdateUserDto } from '../dto';
import { USER_REPOSITORY } from '../repositories/users.repository';
import { createUserFixture } from '../../tests/utils';

class MockUsersRepository {
    private users = new Map<User['id'], User>();

    async create(dto: CreateUserDto) {
        const id = faker.string.uuid();
        const user = { id, createdAt: new Date(), updatedAt: null, ...dto } as User;

        this.users.set(id, user);

        return user;
    }

    async findAll() {
        return Array.from(this.users.values());
    }

    async findById(id: User['id']) {
        return this.users.get(id) || null;
    }

    async update(id: User['id'], dto: UpdateUserDto) {
        if (!this.users.has(id)) return null;
        const updatedUser = { ...this.users.get(id), ...dto };
        this.users.set(id, updatedUser);

        return updatedUser;
    }

    async delete(id: User['id']) {
        this.users.delete(id);
        return true;
    }
}

describe('UsersService', () => {
    let service: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UsersService, { provide: USER_REPOSITORY, useClass: MockUsersRepository }],
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a user', async () => {
        const dto = createUserFixture();
        const user = await service.create(dto);

        expect(user).toMatchObject(dto);
    });

    it('should find all users', async () => {
        const users = [createUserFixture(), createUserFixture()];
        users.forEach(async (user: CreateUserDto) => await service.create(user));

        const foundUsers = await service.findAll();

        expect(foundUsers).toMatchObject(users);
        expect(users).toHaveLength(users.length);
        expect(users).toEqual(expect.arrayContaining(users));
    });

    it('should find a user by id', async () => {
        const user = await service.create(createUserFixture());
        const foundUser = await service.findOne(user.id);

        expect(foundUser).toEqual(user);
    });

    it('should update a user', async () => {
        const user = await service.create(createUserFixture());
        const updatedUser = await service.update(user.id, { fullName: 'New Name' });

        expect(updatedUser).toMatchObject({ ...user, fullName: updatedUser.fullName });
    });

    it('should delete a user', async () => {
        const user = await service.create(createUserFixture());
        await service.remove(user.id);

        await expect(service.findOne(user.id)).rejects.toThrow();
    });
});
