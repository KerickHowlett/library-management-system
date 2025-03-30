import { Module } from '@nestjs/common';
import { BooksService } from './services/books.service';
import { BooksController } from './books.controller';

@Module({
    controllers: [BooksController],
    providers: [BooksService],
})
export class BooksModule {}
