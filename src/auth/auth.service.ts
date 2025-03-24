import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { sha256Hash } from 'src/utils/sha256Hash';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    response: Response,
    username: string,
    pass: string,
  ): Promise<{ decodedAccessToken: object; response: Response }> {
    const user = await this.usersService.findOne(username);

    if (user?.hashedPassword !== sha256Hash(pass)) {
      throw new UnauthorizedException('Invalid password for user.');
    }

    const payload = { sub: user.userId, username: user.username };
    const accessToken = await this.jwtService.signAsync(payload);

    response.cookie('accessToken', accessToken, {
      maxAge: 1000 * 60 * 5,
      httpOnly: true,
    });

    const decodedAccessToken =
      await this.jwtService.verifyAsync<object>(accessToken);
    console.log('decodedAccessToken is: ', decodedAccessToken);

    return { decodedAccessToken, response };
  }

  async signInNoCookies(
    username: string,
    pass: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.usersService.findOne(username);

    if (user?.hashedPassword !== sha256Hash(pass)) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.userId, username: user.username };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
