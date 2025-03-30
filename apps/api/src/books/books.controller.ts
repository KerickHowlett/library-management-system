import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { BooksService } from './services/books.service';
import type { Book } from '@prisma/client';
import type { CreateBookDto, UpdateBookDto } from './dto';

@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) {}

    @Get()
    getBooks() {
        return this.booksService.findAll();
    }

    @Get(':id')
    getBookById(@Param('id') id: Book['id']) {
        return this.booksService.findOne(id);
    }

    @Post()
    createBook(@Body() dto: CreateBookDto) {
        return this.booksService.create(dto);
    }

    @Put(':id')
    updateBook(@Param('id') id: Book['id'], @Body() dto: UpdateBookDto) {
        return this.booksService.update(id, dto);
    }

    @Delete(':id')
    deleteBook(@Param('id') id: Book['id']) {
        return this.booksService.remove(id);
    }
}
