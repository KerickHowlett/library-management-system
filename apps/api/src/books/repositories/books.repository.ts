import { type Book } from '@prisma/client';

export interface BooksRepository {
    findAll(): Promise<Book[]>;
    findById(id: Book['id']): Promise<Book | null>;
    create(book: Book): Promise<Book>;
    update(id: Book['id'], book: Partial<Book>): Promise<Book | null>;
    delete(id: Book['id']): Promise<void>;
}
