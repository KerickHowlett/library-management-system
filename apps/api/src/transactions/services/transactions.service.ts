import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Transaction } from '@prisma/client';

import { CreateTransactionDTO } from '../dto';
import {
    TRANSACTION_REPOSITORY,
    TransactionsRepository,
} from '../repositories/transactions.repository';

const INVALID_TRANSACTION_ID_ERROR = new NotFoundException('invalid transaction id');

@Injectable()
export class TransactionsService {
    constructor(
        @Inject(TRANSACTION_REPOSITORY)
        private readonly transactionsRepository: TransactionsRepository,
    ) {}

    async create(dto: CreateTransactionDTO) {
        return await this.transactionsRepository.create(dto);
    }

    async findAll() {
        return await this.transactionsRepository.findAll();
    }

    async findOne(id: Transaction['id']) {
        const transaction = await this.transactionsRepository.findById(id);
        if (transaction !== null) return transaction;
        throw INVALID_TRANSACTION_ID_ERROR;
    }
}
