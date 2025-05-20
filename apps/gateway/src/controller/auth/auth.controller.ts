import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { lastValueFrom } from 'rxjs';
import { Token } from './dto/token.dto';

@Controller('auth')
export class AuthController {
  @Inject('AUTH_SERVICE')
  private readonly authClient: ClientProxy;

  @Post('login')
  async login(@Body() dto: LoginDto): Promise<Token> {
    const response$ = this.authClient.send<Token, LoginDto>('auth_login', dto);
    return await lastValueFrom(response$);
  }

  @Post('register')
  async register(@Body() dto: CreateUserDto): Promise<Token> {
    const response$ = this.authClient.send<Token, CreateUserDto>(
      'auth_register',
      dto,
    );
    return await lastValueFrom(response$);
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') token: string): Promise<Token> {
    const response$ = this.authClient.send<Token, string>(
      'auth_refresh',
      token,
    );
    return await lastValueFrom(response$);
  }
}
