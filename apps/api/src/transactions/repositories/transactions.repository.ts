import type { Transaction } from '@prisma/client';

import type { CreateTransactionDTO } from '../dto/create-transaction.dto';

export const TRANSACTION_REPOSITORY = 'TRANSACTION_REPOSITORY' as const;

export interface TransactionsRepository {
    findAll(): Promise<Transaction[]>;
    findById(id: Transaction['id']): Promise<Transaction | null>;
    create(transaction: CreateTransactionDTO): Promise<Transaction>;
}
