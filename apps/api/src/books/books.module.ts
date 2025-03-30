import { Module } from '@nestjs/common';

import { BooksService } from './services/books.service';
import { BooksController } from './books.controller';
import { BooksPrismaRepository } from './repositories/books.prisma.respository';
import { PrismaService } from '../prisma/prisma.service';
import { BOOK_REPOSITORY } from './repositories/books.repository';

@Module({
    controllers: [BooksController],
    providers: [
        BooksService,
        {
            provide: BOOK_REPOSITORY,
            useClass: BooksPrismaRepository,
        },
        PrismaService,
    ],
})
export class BooksModule {}
