import { Test, TestingModule } from '@nestjs/testing';
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { execSync } from 'child_process';
import path from 'path';

import { UsersPrismaRepository } from './users.prisma.repository';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateUserDto } from '../dto';

describe('UsersPrismaRepository', () => {
    let container: StartedPostgreSqlContainer;
    let repository: UsersPrismaRepository;

    beforeEach(async () => {
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

    afterEach(async () => {
        await container.stop({
            remove: true,
            removeVolumes: true,
        });
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    it('should create a user', async () => {
        const userData: CreateUserDto = {
            email: 'test@example.com',
            fullName: 'Test User',
        };
        const createdUser = await repository.create(userData);

        expect(createdUser).toMatchObject(userData);
    });

    it('should find a user by ID', async () => {
        const userData: CreateUserDto = {
            email: 'test@example.com',
            fullName: 'Test User',
        };
        const createdUser = await repository.create(userData);

        const foundUser = await repository.findById(createdUser.id);
        expect(foundUser).toMatchObject(createdUser);
    });

    it('should update a user', async () => {
        const userData: CreateUserDto = {
            email: 'test@example.com',
            fullName: 'Test User',
        };
        const createdUser = await repository.create(userData);

        const updatedData = { fullName: 'Updated Test User' };
        const updatedUser = await repository.update(createdUser.id, updatedData);

        expect(updatedUser).toMatchObject({ ...createdUser, fullName: updatedData.fullName });
    });

    it('should delete a user', async () => {
        const userData: CreateUserDto = {
            email: 'test@example.com',
            fullName: 'Test User',
        };
        const createdUser = await repository.create(userData);

        const isDeleted = await repository.delete(createdUser.id);
        expect(isDeleted).toEqual(true);

        const foundUser = await repository.findById(createdUser.id);
        expect(foundUser).toBeNull();
    });

    it('should find all users', async () => {
        const user1: CreateUserDto = {
            email: 'user1@example.com',
            fullName: 'User One',
        };
        await repository.create(user1);

        const user2: CreateUserDto = {
            email: 'user2@example.com',
            fullName: 'User Two',
        };
        await repository.create(user2);

        const users = await repository.findAll();
        expect(users).toHaveLength(2);
        expect(users).toEqual(
            expect.arrayContaining([
                expect.objectContaining(user1),
                expect.objectContaining(user2),
            ]),
        );
    });
});
