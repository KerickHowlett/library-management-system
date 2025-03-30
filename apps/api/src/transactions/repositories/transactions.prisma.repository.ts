import type { Transaction } from '@prisma/client';
import { Logger, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

import type { CreateTransactionDTO } from '../dto/create-transaction.dto';
import { TransactionsRepository } from './transactions.repository';

@Injectable()
export class TransactionsPrismaRepository implements TransactionsRepository {
    private readonly logger;

    constructor(private readonly prismaService: PrismaService) {
        this.logger = new Logger(TransactionsPrismaRepository.name);
    }

    async findAll(): Promise<Transaction[]> {
        try {
            return await this.prismaService.transaction.findMany();
        } catch (error) {
            this.logger.error(error);
            throw InternalServerErrorException;
        }
    }

    async findById(id: Transaction['id']): Promise<Transaction | null> {
        try {
            return await this.prismaService.transaction.findUniqueOrThrow({ where: { id } });
        } catch (error) {
            if (error.code === 'P2025') {
                this.logger.warn(`Transaction with ID ${id} not found.`);
                return null;
            }
            throw InternalServerErrorException;
        }
    }

    async create(transaction: CreateTransactionDTO): Promise<Transaction> {
        try {
            return await this.prismaService.transaction.create({ data: transaction });
        } catch (error) {
            this.logger.error(error);
            throw InternalServerErrorException;
        }
    }
}
