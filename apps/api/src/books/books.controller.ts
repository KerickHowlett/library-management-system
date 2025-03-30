import { Controller, Get } from '@nestjs/common';
import { BooksService } from './services/books.service';

@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) {}

    @Get()
    getBooks() {
        return this.booksService.findAll();
    }
}
