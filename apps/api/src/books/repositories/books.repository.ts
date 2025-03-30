import type { Book } from '@prisma/client';

import type { CreateBookDto } from '../dto/create-book.dto';

export interface BooksRepository {
    findAll(): Promise<Book[]>;
    findById(id: Book['id']): Promise<Book | null>;
    create(book: CreateBookDto): Promise<Book>;
    update(id: Book['id'], book: Partial<Book>): Promise<Book | null>;
    delete(id: Book['id']): Promise<void>;
}
