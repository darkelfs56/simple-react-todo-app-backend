import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma.service';
import { UsersRepository } from './users.repository';

@Module({
  providers: [UsersService, PrismaService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
