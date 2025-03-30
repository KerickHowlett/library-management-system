import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { TransactionsService } from './services/transactions.service';
import { LibraryActionDTO } from './dto/library-action.dto';

@Controller()
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) {}

    @Get('transactions')
    getAllTransactions() {
        return this.transactionsService.findAll();
    }

    @Get('transactions/:id')
    getTransactionById(@Param('id') id: string) {
        return this.transactionsService.findOne(id);
    }

    @Post('checkout')
    createCheckoutTransaction(@Body() dto: LibraryActionDTO) {
        return this.transactionsService.checkoutBook(dto);
    }

    @Post('return')
    createReturnTransaction(@Body() dto: LibraryActionDTO) {
        return this.transactionsService.returnBook(dto);
    }
}
