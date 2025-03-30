import type { Book, Prisma } from '@prisma/client';
import { BadRequestException, Logger, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import isEmpty from 'lodash/isEmpty';

import { BooksRepository } from './books.repository';

@Injectable()
export class BooksPrismaRepository implements BooksRepository {
    private readonly logger = new Logger(BooksPrismaRepository.name);

    constructor(private readonly prismaService: PrismaService) {}

    // TODO: Paginate List
    async findAll(): Promise<Book[]> {
        return await this.prismaService.book.findMany();
    }

    async findById(id: Book['id']): Promise<Book | null> {
        try {
            return await this.prismaService.book.findUniqueOrThrow({ where: { id } });
        } catch (error) {
            return null;
        }
    }

    async create(book: Prisma.BookCreateInput): Promise<Book> {
        return await this.prismaService.book.create({ data: book });
    }

    async update(id: Book['id'], book: Partial<Omit<Book, 'id'>>): Promise<Book | null> {
        if (isEmpty(book)) {
            this.logger.warn(`No data was provided: ${id}`);
            throw BadRequestException;
        }

        try {
            return await this.prismaService.book.update({
                data: book,
                where: { id },
            });
        } catch (error) {
            this.logger.error(error);
            return null;
        }
    }

    async delete(id: Book['id']): Promise<void> {
        await this.prismaService.book.delete({ where: { id } });
    }
}
