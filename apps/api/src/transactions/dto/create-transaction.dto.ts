import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { TransactionAction } from '@prisma/client';

export class CreateTransactionDTO {
    @IsNotEmpty()
    @IsEnum(TransactionAction)
    action: TransactionAction;

    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    bookId: string;
}
