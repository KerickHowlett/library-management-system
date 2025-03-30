import { Test, TestingModule } from '@nestjs/testing';
import type { User } from '@prisma/client';
import { faker } from '@faker-js/faker';

import { UsersController } from './users.controller';
import { UsersService } from './services/users.service';
import type { CreateUserDto, UpdateUserDto } from './dto';

class MockUsersService {
    async findAll(): Promise<User[]> {
        return [
            {
                id: faker.string.uuid(),
                createdAt: new Date(),
                updatedAt: null,
                ...this.createUserFixture(),
            } as User,
        ];
    }

    async findOne(id: User['id']): Promise<User> {
        return {
            id,
            createdAt: new Date(),
            updatedAt: null,
            ...this.createUserFixture(),
        } as User;
    }

    async create(dto: CreateUserDto): Promise<User> {
        return {
            id: faker.string.uuid(),
            createdAt: new Date(),
            updatedAt: null,
            ...dto,
        } as User;
    }

    async update(id: User['id'], dto: UpdateUserDto): Promise<User> {
        return {
            id,
            createdAt: new Date(),
            updatedAt: null,
            ...dto,
        } as User;
    }

    async remove(_id: User['id']): Promise<void> {
        return;
    }

    private createUserFixture(): CreateUserDto {
        return {
            email: faker.internet.email(),
            fullName: faker.person.fullName(),
        };
    }
}

describe('UsersController', () => {
    let controller: UsersController;
    let mockUsersService: MockUsersService;

    beforeEach(async () => {
        mockUsersService = new MockUsersService();

        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: mockUsersService,
                },
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should return all users', async () => {
        const users = await controller.getUsers();
        expect(users.length).toEqual(1);
    });

    it('should return a single user by ID', async () => {
        const id = faker.string.uuid();
        const user = await controller.getUserById(id);

        expect(user.id).toEqual(id);
    });

    it('should create a new user', async () => {
        const dto: CreateUserDto = {
            email: faker.internet.email(),
            fullName: faker.person.fullName(),
        };
        const user = await controller.createUser(dto);

        expect(user).toMatchObject(dto);
    });

    it('should update a user by ID', async () => {
        const id = faker.string.uuid();
        const dto: UpdateUserDto = { fullName: 'Updated User' };
        const updatedUser = await controller.updateUser(id, dto);

        expect(updatedUser).toMatchObject({ ...dto, id });
    });

    it('should delete a user by ID', async () => {
        const removeUserSpy = jest.spyOn(mockUsersService, 'remove').mockResolvedValueOnce();

        const id = faker.string.uuid();
        await controller.deleteUser(id);

        expect(removeUserSpy).toHaveBeenCalledWith(id);
    });
});
