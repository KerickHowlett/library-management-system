import { Test, TestingModule } from '@nestjs/testing';
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql';

import { BooksPrismaRepository } from './books.prisma.respository';
import { createBookFixture } from '../../tests/utils';
import { ConfigModule } from '@nestjs/config';
import { execSync } from 'child_process';
import path from 'path';

import { PrismaService } from '../../prisma/prisma.service';
import type { CreateBookDto } from '../dto';

describe('BooksController', () => {
    let container: StartedPostgreSqlContainer;
    let repository: BooksPrismaRepository;

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
            imports: [ConfigModule],
            providers: [BooksPrismaRepository, PrismaService],
        }).compile();

        repository = module.get<BooksPrismaRepository>(BooksPrismaRepository);
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

    it('should create a book', async () => {
        const bookData = createBookFixture() as CreateBookDto;
        const createdBook = await repository.create(bookData);

        expect(createdBook).toMatchObject(bookData);
    });

    it('should find a book by ID', async () => {
        const bookData = createBookFixture() as CreateBookDto;
        const createdBook = await repository.create(bookData);

        const foundBook = await repository.findById(createdBook.id);
        expect(foundBook).toMatchObject(createdBook);
    });

    it('should update a book', async () => {
        const bookData = createBookFixture() as CreateBookDto;
        const createdBook = await repository.create(bookData);

        const updatedData = { title: 'Updated Test Book' };
        const updatedBook = await repository.update(createdBook.id, updatedData);

        expect(updatedBook).toMatchObject({ ...createdBook, title: updatedData.title });
    });

    it('should delete a book', async () => {
        const bookData = createBookFixture() as CreateBookDto;
        const createdBook = await repository.create(bookData);

        await repository.delete(createdBook.id);

        const foundBook = await repository.findById(createdBook.id);
        expect(foundBook).toBeNull();
    });

    it('should find all books', async () => {
        const book1 = createBookFixture() as CreateBookDto;
        await repository.create(book1);

        const book2 = createBookFixture() as CreateBookDto;
        await repository.create(book2);

        const books = await repository.findAll();
        expect(books).toHaveLength(2);
        expect(books).toEqual(
            expect.arrayContaining([
                expect.objectContaining(book1),
                expect.objectContaining(book2),
            ]),
        );
    });
});
