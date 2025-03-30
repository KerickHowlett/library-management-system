import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { User } from '@prisma/client';

import { CreateUserDto, UpdateUserDto } from '../dto';
import { USER_REPOSITORY, UsersRepository } from '../repositories/users.repository';

const INVALID_USER_ID_ERROR = new NotFoundException('invalid user id');

@Injectable()
export class UsersService {
    constructor(@Inject(USER_REPOSITORY) private readonly usersRepository: UsersRepository) {}

    async create(dto: CreateUserDto) {
        return await this.usersRepository.create(dto);
    }

    async findAll() {
        return await this.usersRepository.findAll();
    }

    async findOne(id: User['id']) {
        const user = await this.usersRepository.findById(id);
        if (user !== null) return user;
        throw INVALID_USER_ID_ERROR;
    }

    async update(id: User['id'], dto: UpdateUserDto) {
        return await this.usersRepository.update(id, dto);
    }

    async remove(id: User['id']) {
        const isDeleted = await this.usersRepository.delete(id);
        if (isDeleted) return;
        throw INVALID_USER_ID_ERROR;
    }
}
