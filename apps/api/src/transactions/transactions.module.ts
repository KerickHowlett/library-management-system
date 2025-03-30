import { Module } from '@nestjs/common';

import { TransactionsService } from './services/transactions.service';
import { TransactionsPrismaRepository } from './repositories/transactions.prisma.repository';
import { PrismaService } from '../prisma/prisma.service';
import { TRANSACTION_REPOSITORY } from './repositories/transactions.repository';

@Module({
    providers: [
        TransactionsService,
        {
            provide: TRANSACTION_REPOSITORY,
            useClass: TransactionsPrismaRepository,
        },
        PrismaService,
    ],
})
export class TransactionsModule {}
