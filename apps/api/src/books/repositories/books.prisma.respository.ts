import type { Book } from '@prisma/client';
import {
    BadRequestException,
    Logger,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import isEmpty from 'lodash/isEmpty';

import type { CreateBookDto } from '../dto/create-book.dto';
import { BooksRepository } from './books.repository';

@Injectable()
export class BooksPrismaRepository implements BooksRepository {
    private readonly logger;

    constructor(private readonly prismaService: PrismaService) {
        this.logger = new Logger(BooksPrismaRepository.name);
    }

    // TODO: Paginate List
    async findAll(): Promise<Book[]> {
        try {
            return await this.prismaService.book.findMany();
        } catch (error) {
            this.logger.error(error);
            throw InternalServerErrorException;
        }
    }

    async findById(id: Book['id']): Promise<Book | null> {
        try {
            return await this.prismaService.book.findUniqueOrThrow({ where: { id } });
        } catch (error) {
            // Prisma error code for "Record not found"
            if (error.code === 'P2025') {
                this.logger.warn(`Book with ID ${id} not found.`);
                return null;
            }
            throw InternalServerErrorException;
        }
    }

    async create(book: CreateBookDto): Promise<Book> {
        try {
            return await this.prismaService.book.create({ data: book });
        } catch (error) {
            this.logger.error(error);
            throw InternalServerErrorException;
        }
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
            // Prisma error code for "Record not found"
            if (error.code === 'P2025') {
                this.logger.warn(`Book with ID ${id} not found.`);
                return null;
            }
            throw InternalServerErrorException;
        }
    }

    async delete(id: Book['id']): Promise<boolean> {
        try {
            await this.prismaService.book.delete({ where: { id } });
            return true;
        } catch (error) {
            // Prisma error code for "Record not found"
            if (error.code === 'P2025') {
                this.logger.warn(`Book with ID ${id} not found.`);
                return false;
            }
            throw InternalServerErrorException;
        }
    }
}
