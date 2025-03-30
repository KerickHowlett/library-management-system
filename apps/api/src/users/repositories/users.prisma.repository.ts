import type { User } from '@prisma/client';
import {
    BadRequestException,
    Logger,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import isEmpty from 'lodash/isEmpty';

import type { CreateUserDto } from '../dto/create-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersPrismaRepository implements UsersRepository {
    private readonly logger;

    constructor(private readonly prismaService: PrismaService) {
        this.logger = new Logger(UsersPrismaRepository.name);
    }

    async findAll(): Promise<User[]> {
        try {
            return await this.prismaService.user.findMany();
        } catch (error) {
            this.logger.error(error);
            throw InternalServerErrorException;
        }
    }

    async findById(id: User['id']): Promise<User | null> {
        try {
            return await this.prismaService.user.findUniqueOrThrow({ where: { id } });
        } catch (error) {
            if (error.code === 'P2025') {
                this.logger.warn(`User with ID ${id} not found.`);
                return null;
            }
            throw InternalServerErrorException;
        }
    }

    async create(user: CreateUserDto): Promise<User> {
        try {
            return await this.prismaService.user.create({ data: user });
        } catch (error) {
            this.logger.error(error);
            throw InternalServerErrorException;
        }
    }

    async update(id: User['id'], user: Partial<Omit<User, 'id'>>): Promise<User | null> {
        if (isEmpty(user)) {
            this.logger.warn(`No data was provided: ${id}`);
            throw BadRequestException;
        }

        try {
            return await this.prismaService.user.update({
                data: user,
                where: { id },
            });
        } catch (error) {
            if (error.code === 'P2025') {
                this.logger.warn(`User with ID ${id} not found.`);
                return null;
            }
            throw InternalServerErrorException;
        }
    }

    async delete(id: User['id']): Promise<boolean> {
        try {
            await this.prismaService.user.delete({ where: { id } });
            return true;
        } catch (error) {
            if (error.code === 'P2025') {
                this.logger.warn(`User with ID ${id} not found.`);
                return false;
            }
            throw InternalServerErrorException;
        }
    }
}
