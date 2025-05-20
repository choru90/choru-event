import { Body, Controller, Post } from '@nestjs/common';
import { Client, ClientProxy } from '@nestjs/microservices';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Token } from './dto/token.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Client({ name: 'AUTH_SERVICE' })
    private readonly authClient: ClientProxy,
  ) {}

  @Post('login')
  async login(@Body() dto: LoginDto): Promise<Token> {
    return this.authClient.send<Token>('auth_login', dto).toPromise();
  }

  @Post('register')
  async register(@Body() dto: CreateUserDto): Promise<Token> {
    return this.authClient.send<Token>('auth_register', dto).toPromise();
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') token: string): Promise<Token> {
    return this.authClient.send<Token>('auth_refresh', token).toPromise();
  }
}
