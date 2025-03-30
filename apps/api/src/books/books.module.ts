import { Module } from '@nestjs/common';

import { BooksService } from './services/books.service';
import { BooksController } from './books.controller';
import { BooksPrismaRepository } from './repositories/books.prisma.respository';

@Module({
    controllers: [BooksController],
    providers: [
        BooksService,
        {
            provide: 'BOOK_REPOSITORY',
            useValue: BooksPrismaRepository,
        },
    ],
})
export class BooksModule {}
