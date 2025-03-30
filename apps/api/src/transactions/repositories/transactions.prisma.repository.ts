import { Prisma, TransactionAction, type Transaction } from '@prisma/client';
import {
    Logger,
    Injectable,
    InternalServerErrorException,
    BadRequestException,
} from '@nestjs/common';
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
            return await this.prismaService.transaction.findMany({
                orderBy: { timestamp: 'desc' },
            });
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

    async create(dto: CreateTransactionDTO): Promise<Transaction> {
        try {
            const [, transaction] = await this.prismaService.$transaction([
                this.prismaService.book.update({
                    where: { id: dto.bookId },
                    data: { userId: this.getCheckedOutByValue(dto) },
                }),
                this.prismaService.transaction.create({ data: dto }),
            ]);

            return transaction;
        } catch (error) {
            this.logger.error(error);
            if (error.code === 'P2025') {
                throw new BadRequestException(
                    `invalid user or book id: { userId: ${dto.userId}, bookId: ${dto.bookId} }`,
                );
            }
            throw InternalServerErrorException;
        }
    }

    private getCheckedOutByValue({ action, userId }: CreateTransactionDTO): string | null {
        return action === TransactionAction.CheckedOut ? userId : null;
    }
}
