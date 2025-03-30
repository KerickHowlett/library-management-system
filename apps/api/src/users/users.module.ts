import { Module } from '@nestjs/common';

import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';
import { UsersPrismaRepository } from './repositories/users.prisma.repository';
import { PrismaService } from '../prisma/prisma.service';
import { USER_REPOSITORY } from './repositories/users.repository';

@Module({
    controllers: [UsersController],
    providers: [
        UsersService,
        {
            provide: USER_REPOSITORY,
            useClass: UsersPrismaRepository,
        },
        PrismaService,
    ],
})
export class UsersModule {}
