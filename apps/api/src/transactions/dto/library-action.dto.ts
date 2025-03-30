import { IsNotEmpty, IsUUID } from 'class-validator';

export class LibraryActionDTO {
    @IsUUID()
    @IsNotEmpty()
    bookId: string;

    @IsUUID()
    @IsNotEmpty()
    userId: string;
}
