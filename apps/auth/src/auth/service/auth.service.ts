// apps/auth/src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../../../../gateway/src/controller/auth/dto/create-user.dto';
import { LoginDto } from '../../../../gateway/src/controller/auth/dto/login.dto';
import { Token } from '../../../../gateway/src/controller/auth/dto/token.dto';
import { UsersService } from '../../users/service/users.service';
import { JwtPayload } from '../types/jwt-payload.interface';
import { User } from '../../users/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: LoginDto): Promise<Token> {
    const { email, password } = dto;
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (!(await user.validatePassword(password)))
      throw new UnauthorizedException('Invalid credentials');

    return this.getTokens(user);
  }

  async register(dto: CreateUserDto): Promise<Token> {
    const user = await this.usersService.create(dto);
    return this.getTokens(user);
  }

  async refresh(refreshToken: string): Promise<Token> {
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const user = await this.usersService.findById(payload.userId);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    await user?.validateRefreshToken(refreshToken);
    return this.getTokens(user);
  }

  private async getTokens(user: User): Promise<Token> {
    const payload: JwtPayload = user.getPayload();

    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.get<string>('JWT_SECRET'),
      expiresIn: this.config.get<string>('JWT_EXPIRES_IN'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN'),
    });

    const hash = await bcrypt.hash(refreshToken, 10);
    await this.usersService.setCurrentRefreshToken(user.getStringId(), hash);

    return { accessToken, refreshToken };
  }
}
