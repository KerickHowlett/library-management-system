import { Test, TestingModule } from '@nestjs/testing';
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { execSync } from 'child_process';
import path from 'path';

import { BooksPrismaRepository } from './books.prisma.respository';
import { createBookFixture } from '../../tests/utils';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateBookDto } from '../dto';
import { range } from 'lodash';

describe('BooksController', () => {
    let container: StartedPostgreSqlContainer;
    let repository: BooksPrismaRepository;

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
            providers: [BooksPrismaRepository, PrismaService],
        }).compile();

        repository = module.get<BooksPrismaRepository>(BooksPrismaRepository);
    });

    afterAll(async () => await container.stop());

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

        const isDeleted = await repository.delete(createdBook.id);
        expect(isDeleted).toEqual(true);

        const foundBook = await repository.findById(createdBook.id);
        expect(foundBook).toBeNull();
    });

    it('should find all books', async () => {
        const books = range(2).map(() => createBookFixture() as CreateBookDto);
        await Promise.all([repository.create(books[0]), repository.create(books[1])]);

        const foundBooks = await repository.findAll();
        expect(foundBooks.length).toBeGreaterThanOrEqual(books.length);

        const matchingBooks = foundBooks.filter((foundBook) =>
            books.some((book) => book.title === foundBook.title),
        );
        expect(foundBooks).toEqual(expect.arrayContaining(matchingBooks));
    });
});
