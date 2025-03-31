import { Test, TestingModule } from '@nestjs/testing';
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { execSync } from 'child_process';
import path from 'path';

import { UsersPrismaRepository } from './users.prisma.repository';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateUserDto } from '../dto';
import { range } from 'lodash';
import { faker } from '@faker-js/faker/.';

describe('UsersPrismaRepository', () => {
    let repository: UsersPrismaRepository;
    let container: StartedPostgreSqlContainer;

    beforeAll(async () => {
        container = await new PostgreSqlContainer().start();

        const DB_ENV = {
            POSTGRES_HOST: container.getHost(),
            POSTGRES_PASSWORD: container.getPassword(),
            POSTGRES_USER: container.getUsername(),
            POSTGRES_DB: container.getName(),
            POSTGRES_PORT: container.getPort().toString(),
        } as const;

        const DATABASE_URL = `postgresql://${DB_ENV.POSTGRES_USER}:${DB_ENV.POSTGRES_PASSWORD}@${DB_ENV.POSTGRES_HOST}:${DB_ENV.POSTGRES_PORT}/${DB_ENV.POSTGRES_DB}?schema=public`;
        process.env.DATABASE_URL = DATABASE_URL;

        execSync('npx prisma migrate dev', {
            env: { ...process.env, ...DB_ENV, DATABASE_URL },
            cwd: path.resolve(__dirname, '../../../../..'),
        });

        const module: TestingModule = await Test.createTestingModule({
            providers: [UsersPrismaRepository, PrismaService],
        }).compile();

        repository = module.get<UsersPrismaRepository>(UsersPrismaRepository);
    });

    afterAll(async () => await container.stop());

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    it('should create a user', async () => {
        const userData: CreateUserDto = {
            email: faker.internet.email(),
            fullName: faker.person.fullName(),
        };
        const createdUser = await repository.create(userData);

        expect(createdUser).toMatchObject(userData);
    });

    it('should find a user by ID', async () => {
        const userData: CreateUserDto = {
            email: faker.internet.email(),
            fullName: faker.person.fullName(),
        };
        const createdUser = await repository.create(userData);

        const foundUser = await repository.findById(createdUser.id);
        expect(foundUser).toMatchObject(createdUser);
    });

    it('should update a user', async () => {
        const userData: CreateUserDto = {
            email: faker.internet.email(),
            fullName: faker.person.fullName(),
        };
        const createdUser = await repository.create(userData);

        const updatedData = { fullName: 'Updated Test User' };
        const updatedUser = await repository.update(createdUser.id, updatedData);

        expect(updatedUser).toMatchObject({ ...createdUser, fullName: updatedData.fullName });
    });

    it('should delete a user', async () => {
        const userData: CreateUserDto = {
            email: faker.internet.email(),
            fullName: faker.person.fullName(),
        };
        const createdUser = await repository.create(userData);

        const isDeleted = await repository.delete(createdUser.id);
        expect(isDeleted).toEqual(true);

        const foundUser = await repository.findById(createdUser.id);
        expect(foundUser).toBeNull();
    });

    it('should find all users', async () => {
        const users = range(2).map(() => ({
            email: faker.internet.email(),
            fullName: faker.person.fullName(),
        }));

        await repository.create(users[0]);
        await repository.create(users[1]);

        const foundUsers = await repository.findAll();
        expect(foundUsers.length).toBeGreaterThanOrEqual(users.length);

        const matchingUsers = foundUsers.filter((user) =>
            users.some((u) => u.email === user.email),
        );
        expect(matchingUsers).toEqual(
            expect.arrayContaining(users.map((user) => expect.objectContaining(user))),
        );
    });
});
