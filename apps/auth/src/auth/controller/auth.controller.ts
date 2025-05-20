import { Controller } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { CreateUserDto } from '../../../../gateway/src/controller/auth/dto/create-user.dto';
import { LoginDto } from '../../../../gateway/src/controller/auth/dto/login.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth_register')
  register(@Payload() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @MessagePattern('auth_login')
  async login(@Payload() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @MessagePattern('auth_refresh')
  async refresh(@Payload() refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }
}
