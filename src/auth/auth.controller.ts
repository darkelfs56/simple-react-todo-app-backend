import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './guard/auth.guard';
import { AuthService } from './auth.service';
import { Request as ExpressRequest, Response } from 'express';
import { SignInDto } from './dto/SignInDto';
import { User } from 'src/users/users.service';

//To make public (skip Auth) routes,
// especially useful if set AuthGuard globally
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto, @Res() response: Response) {
    const { decodedAccessToken, response: responseModified } =
      await this.authService.signIn(
        response,
        signInDto.username,
        signInDto.password,
      );

    response = responseModified;
    return response.send(decodedAccessToken);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: ExpressRequest) {
    return req['user'] as User;
  }

  @Public()
  @Get()
  helloUser() {
    return 'Hello User!';
  }
}
