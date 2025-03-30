import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { HttpStatus } from '@nestjs/common';
import { execSync } from 'child_process';
import { faker } from '@faker-js/faker';
import axios from 'axios';
import path from 'path';
import { Book } from '@prisma/client';

function createBookDTO(): Partial<Book> {
    return {
        author: faker.book.author(),
        edition: faker.datatype.boolean() ? faker.number.int({ min: 1, max: 20 }).toString() : null,
        genre: faker.book.genre(),
        publisher: faker.book.publisher(),
        series: faker.datatype.boolean() ? faker.book.series() : null,
        title: faker.book.title(),
    };
}

describe('GET /api/books', () => {
    let container: StartedPostgreSqlContainer;

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
    });

    afterEach(async () => {
        await container.stop({
            remove: true,
            removeVolumes: true,
        });
    });

    it('should create books', async () => {
        const dto = createBookDTO();
        const response = await axios.post(`/api/books`, dto);

        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.data).toMatchObject({
            ...dto,
            id: expect.any(String),
            createdAt: expect.any(Date),
        });
    });

    it('should get all books', async () => {
        const [{ data: book1 }, { data: book2 }] = await Promise.all([
            axios.post(`/api/books`, createBookDTO()),
            axios.post(`/api/books`, createBookDTO()),
        ]);

        const { data: books, status } = await axios.get(`/api/books`);

        expect(status).toEqual(HttpStatus.OK);
        expect(books).toHaveLength(2);
        expect(books).toEqual(
            expect.arrayContaining([
                expect.objectContaining(book1),
                expect.objectContaining(book2),
            ]),
        );
    });

    it('should update book', async () => {
        const { data: book } = await axios.post(`/api/books`, createBookDTO());

        const updateDTO = { title: faker.book.title() };
        const { data: updatedBook, status } = await axios.put(`/api/books`, updateDTO);

        expect(status).toEqual(HttpStatus.OK);
        expect(updatedBook).toMatchObject({
            ...book,
            title: updateDTO.title,
        });
    });

    it('should find book by id', async () => {
        const { data: book } = await axios.post(`/api/books`, createBookDTO());

        const response = await axios.get(`/api/books/${book.id}`);

        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.data).toMatchObject(book);
    });

    it('should delete book', async () => {
        const { data: book } = await axios.post(`/api/books`, createBookDTO());

        const { status } = await axios.delete(`/api/books/${book.id}`);

        expect(status).toEqual(HttpStatus.OK);

        const response = await axios.get(`/api/books/${book.id}`);

        expect(response.status).toEqual(HttpStatus.NOT_FOUND);
        expect(response.data).toBeNull();
    });
});
