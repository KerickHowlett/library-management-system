import { Test, TestingModule } from '@nestjs/testing';
import type { Book } from '@prisma/client';
import { faker } from '@faker-js/faker';

import { BooksController } from './books.controller';
import { BooksService } from './services/books.service';
import { createBookFixture } from '../tests/utils';
import type { CreateBookDto, UpdateBookDto } from './dto';

class MockBooksService {
    async findAll(): Promise<Book[]> {
        return [
            {
                id: faker.string.uuid(),
                createdAt: new Date(),
                updatedAt: null,
                userId: null,
                ...createBookFixture(),
            } as Book,
        ];
    }

    async findOne(id: Book['id']): Promise<Book> {
        return {
            id,
            createdAt: new Date(),
            updatedAt: null,
            userId: null,
            ...createBookFixture(),
        } as Book;
    }

    async create(dto: CreateBookDto): Promise<Book> {
        return {
            id: faker.string.uuid(),
            createdAt: new Date(),
            updatedAt: null,
            userId: null,
            ...dto,
        } as Book;
    }

    async update(id: Book['id'], dto: UpdateBookDto): Promise<Book> {
        return {
            id,
            createdAt: new Date(),
            updatedAt: null,
            userId: null,
            ...dto,
        } as Book;
    }

    async remove(_id: Book['id']): Promise<void> {
        return;
    }
}

describe('BooksController', () => {
    let controller: BooksController;
    let mockBooksService: MockBooksService;

    beforeEach(async () => {
        mockBooksService = new MockBooksService();

        const module: TestingModule = await Test.createTestingModule({
            controllers: [BooksController],
            providers: [
                {
                    provide: BooksService,
                    useValue: mockBooksService,
                },
            ],
        }).compile();

        controller = module.get<BooksController>(BooksController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should return all books', async () => {
        const books = await controller.getBooks();
        expect(books.length).toEqual(1);
    });

    it('should return a single book by ID', async () => {
        const id = faker.string.uuid();
        const book = await controller.getBookById(id);

        expect(book.id).toEqual(id);
    });

    it('should create a new book', async () => {
        const dto = createBookFixture() as CreateBookDto;
        const book = await controller.createBook(dto);

        expect(book).toMatchObject(dto);
    });

    it('should update a book by ID', async () => {
        const id = faker.string.uuid();
        const dto = { title: 'Updated Book' } as UpdateBookDto;
        const updatedBook = await controller.updateBook(id, dto);

        expect(updatedBook).toMatchObject({ ...dto, id });
    });

    it('should delete a book by ID', async () => {
        const removeBookSpy = jest.spyOn(mockBooksService, 'remove').mockResolvedValueOnce();

        const id = faker.string.uuid();
        await controller.deleteBook(id);

        expect(removeBookSpy).toHaveBeenCalledWith(id);
    });
});
