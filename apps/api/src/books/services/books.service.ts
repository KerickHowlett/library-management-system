import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Book } from '@prisma/client';

import { CreateBookDto, UpdateBookDto } from '../dto';
import { BOOK_REPOSITORY, BooksRepository } from '../repositories/books.repository';

const INVALID_BOOK_ID_ERROR = new NotFoundException('invalid book id');

@Injectable()
export class BooksService {
    constructor(@Inject(BOOK_REPOSITORY) private readonly booksRepository: BooksRepository) {}

    async create(dto: CreateBookDto) {
        return await this.booksRepository.create(dto);
    }

    async findAll() {
        return await this.booksRepository.findAll();
    }

    async findOne(id: Book['id']) {
        const book = await this.booksRepository.findById(id);
        if (book !== null) return book;
        throw INVALID_BOOK_ID_ERROR;
    }

    async update(id: Book['id'], dto: UpdateBookDto) {
        return await this.booksRepository.update(id, dto);
    }

    async remove(id: Book['id']) {
        const isDeleted = await this.booksRepository.delete(id);
        if (isDeleted) return;
        throw INVALID_BOOK_ID_ERROR;
    }
}
