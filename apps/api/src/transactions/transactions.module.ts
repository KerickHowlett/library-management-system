import { Module } from '@nestjs/common';

import { TransactionsService } from './services/transactions.service';
import { TransactionsPrismaRepository } from './repositories/transactions.prisma.repository';
import { PrismaService } from '../prisma/prisma.service';
import { TRANSACTION_REPOSITORY } from './repositories/transactions.repository';
import { TransactionsController } from './transactions.controller';

@Module({
    providers: [
        TransactionsService,
        {
            provide: TRANSACTION_REPOSITORY,
            useClass: TransactionsPrismaRepository,
        },
        PrismaService,
    ],
    controllers: [TransactionsController],
})
export class TransactionsModule {}
