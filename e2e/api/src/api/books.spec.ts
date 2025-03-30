import { HttpStatus } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { Book } from '@prisma/client';
import axios from 'axios';

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

describe('/api/books', () => {
    it('POST > should create books', async () => {
        const dto = createBookDTO();
        const response = await axios.post(`/api/books`, dto);

        expect(response.status).toEqual(HttpStatus.CREATED);
        expect(response.data).toMatchObject({
            ...dto,
            id: expect.any(String),
        });
    });

    it('GET > should get all books', async () => {
        await Promise.all([
            axios.post(`/api/books`, createBookDTO()),
            axios.post(`/api/books`, createBookDTO()),
        ]);

        const { data: books, status } = await axios.get(`/api/books`);

        expect(status).toEqual(HttpStatus.OK);
        expect(books.length).toBeGreaterThanOrEqual(2);
    });

    it('PUT > should update book', async () => {
        const { data: book } = await axios.post(`/api/books`, createBookDTO());

        const updateDTO = { title: faker.book.title() };
        const { data: updatedBook, status } = await axios.put(`/api/books/${book.id}`, updateDTO);

        expect(status).toEqual(HttpStatus.OK);
        expect(updatedBook).toMatchObject({
            ...book,
            title: updateDTO.title,
        });
    });

    it('GET > should find book by id', async () => {
        const { data: book } = await axios.post(`/api/books`, createBookDTO());

        const response = await axios.get(`/api/books/${book.id}`);

        expect(response.status).toEqual(HttpStatus.OK);
        expect(response.data).toMatchObject(book);
    });

    it('DELETE > should delete book', async () => {
        const { data: book } = await axios.post(`/api/books`, createBookDTO());

        const { status } = await axios.delete(`/api/books/${book.id}`);

        expect(status).toEqual(HttpStatus.OK);

        await expect(axios.get(`/api/books/${book.id}`)).rejects.toThrow(
            'Request failed with status code 404',
        );
    });
});
