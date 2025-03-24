import { Injectable, NotFoundException } from '@nestjs/common';
// import { sha256Hash } from 'src/utils/sha256Hash';
import { UsersRepository } from './users.repository';

export type User = {
  userId: number;
  username: string;
  hashedPassword: string;
};

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  // private readonly users: User[] = [
  //   {
  //     userId: 1,
  //     username: 'john',
  //     hashedPassword: sha256Hash('changeme'),
  //   },
  //   {
  //     userId: 2,
  //     username: 'maria',
  //     hashedPassword: sha256Hash('guess'),
  //   },
  // ];

  private transformUserQueryResult(
    user: NonNullable<Awaited<ReturnType<UsersRepository['findOne']>>>,
  ) {
    return {
      userId: user.id,
      username: user.name,
      hashedPassword: user.hashed_password,
    } as User;
  }

  async findOne(username: string): Promise<User | undefined> {
    return await this.usersRepository
      .findOne(username)
      .then((user) => {
        if (!user)
          throw new Error(`No user with username ${username} is found!`);
        return this.transformUserQueryResult(user);
      })
      .catch((err: Error) => {
        throw new NotFoundException(err.message);
      });
  }
}
