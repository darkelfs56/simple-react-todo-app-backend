import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async findOne(username: string) {
    return await this.prismaService.user.findFirst({
      where: {
        name: username,
      },
    });
  }
}
