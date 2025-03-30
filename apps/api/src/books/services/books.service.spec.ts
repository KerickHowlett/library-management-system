import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { Book } from '@prisma/client';
import { faker } from '@faker-js/faker/.';

import { CreateBookDto, UpdateBookDto } from '../dto';
import { createBookFixture } from '../../tests/utils';
import { BOOK_REPOSITORY } from '../repositories/books.repository';
import { NotFoundException } from '@nestjs/common';

class MockBooksRepository {
    private books = new Map<Book['id'], Book>();

    async create(dto: CreateBookDto) {
        const id = faker.string.uuid();
        const book = { id, createdAt: new Date(), updatedAt: null, userId: null, ...dto } as Book;

        this.books.set(id, book);

        return book;
    }

    async findAll() {
        return Array.from(this.books.values());
    }

    async findById(id: Book['id']) {
        return this.books.get(id) || null;
    }

    async update(id: Book['id'], dto: UpdateBookDto) {
        if (!this.books.has(id)) return null;
        const updatedBook = { ...this.books.get(id), ...dto };
        this.books.set(id, updatedBook);

        return updatedBook;
    }

    async delete(id: Book['id']) {
        this.books.delete(id);
        return true;
    }
}

describe('BooksService', () => {
    let service: BooksService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [BooksService, { provide: BOOK_REPOSITORY, useClass: MockBooksRepository }],
        }).compile();

        service = module.get<BooksService>(BooksService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a book', async () => {
        const dto = createBookFixture() as CreateBookDto;
        const book = await service.create(dto);

        expect(book).toMatchObject(dto);
    });

    it('should find all books', async () => {
        const books = [createBookFixture(), createBookFixture()];
        books.forEach(async (book: CreateBookDto) => await service.create(book));

        const foundBook = await service.findAll();

        expect(foundBook).toMatchObject(books);
        expect(books).toHaveLength(books.length);
        expect(books).toEqual(expect.arrayContaining(books));
    });

    it('should find a book by id', async () => {
        const book = await service.create(createBookFixture() as CreateBookDto);
        const foundBook = await service.findOne(book.id);

        expect(foundBook).toEqual(book);
    });

    it('should update a book', async () => {
        const book = await service.create(createBookFixture() as CreateBookDto);
        const updatedBook = await service.update(book.id, { title: 'New Title' });

        expect(updatedBook).toMatchObject({ ...book, title: updatedBook.title });
    });

    it('should delete a book', async () => {
        const book = await service.create(createBookFixture() as CreateBookDto);
        await service.remove(book.id);

        await expect(service.findOne(book.id)).rejects.toThrow(NotFoundException);
    });
});
