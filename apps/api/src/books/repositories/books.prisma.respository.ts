import type { Book } from '@prisma/client';
import type { BooksRepository } from './books.repository';
import type { PrismaService } from '../../prisma/prisma.service';

export class BooksPrismaRepository implements BooksRepository {
    constructor(private readonly prismaService: PrismaService) {}

    async findAll(): Promise<Book[]> {
        throw new Error('Method not implemented.');
    }

    async findById(id: Book['id']): Promise<Book | null> {
        throw new Error('Method not implemented.');
    }

    async create(book: Book): Promise<Book> {
        throw new Error('Method not implemented.');
    }

    async update(id: Book['id'], book: Partial<Book>): Promise<Book | null> {
        throw new Error('Method not implemented.');
    }

    async delete(id: Book['id']): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
