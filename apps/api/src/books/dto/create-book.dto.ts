import { IsNotEmpty, IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateBookDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    edition?: string | null | undefined;

    @IsString()
    @IsNotEmpty()
    author: string;

    @IsString()
    @IsNotEmpty()
    genre: string;

    @IsString()
    @IsOptional()
    series?: string | null | undefined;

    @IsString()
    @IsNotEmpty()
    publisher: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    fullName: string;
}
