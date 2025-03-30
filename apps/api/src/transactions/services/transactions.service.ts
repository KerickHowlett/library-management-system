import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TransactionAction, type Transaction } from '@prisma/client';

import { CreateTransactionDTO } from '../dto';
import {
    TRANSACTION_REPOSITORY,
    TransactionsRepository,
} from '../repositories/transactions.repository';
import { LibraryActionDTO } from '../dto/library-action.dto';

const INVALID_TRANSACTION_ID_ERROR = new NotFoundException('invalid transaction id');

@Injectable()
export class TransactionsService {
    constructor(
        @Inject(TRANSACTION_REPOSITORY)
        private readonly transactionsRepository: TransactionsRepository,
    ) {}

    async checkoutBook(dto: LibraryActionDTO) {
        return await this.transactionsRepository.create({
            ...dto,
            action: TransactionAction.CheckedOut,
        });
    }

    async findAll() {
        return await this.transactionsRepository.findAll();
    }

    async findOne(id: Transaction['id']) {
        const transaction = await this.transactionsRepository.findById(id);
        if (transaction !== null) return transaction;
        throw INVALID_TRANSACTION_ID_ERROR;
    }

    async returnBook(dto: LibraryActionDTO) {
        return await this.transactionsRepository.create({
            ...dto,
            action: TransactionAction.Returned,
        });
    }
}
