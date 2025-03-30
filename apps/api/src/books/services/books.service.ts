import { Inject, Injectable } from '@nestjs/common';
import type { Book } from '@prisma/client';

import { CreateBookDto, UpdateBookDto } from '../dto';
import { BooksRepository } from '../repositories/books.repository';

@Injectable()
export class BooksService {
    constructor(@Inject('BOOK_REPOSITORY') private readonly booksRepository: BooksRepository) {}

    async create(dto: CreateBookDto) {
        return await this.booksRepository.create(dto);
    }

    async findAll() {
        return await this.booksRepository.findAll();
    }

    async findOne(id: Book['id']) {
        return await this.booksRepository.findById(id);
    }

    async update(id: Book['id'], dto: UpdateBookDto) {
        return await this.booksRepository.update(id, dto);
    }

    async remove(id: Book['id']) {
        return await this.booksRepository.delete(id);
    }
}
