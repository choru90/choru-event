// apps/gateway/src/gateway.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './controller/auth/auth.controller';
import { EventController } from './controller/event/event.controller';
import { RewardController } from './controller/reward/reward.controller';
import { JwtAuthGuard } from './guard/jwt-auth.gurad';
import { RolesGuard } from './guard/roles.guard';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './guard/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.get<string>('JWT_SECRET')!,
        signOptions: { expiresIn: cfg.get<string>('JWT_EXPIRES_IN') },
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (cfg: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            servers: [cfg.get<string>('NATS_URL')!],
          },
        }),
      },
      {
        name: 'EVENT_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (cfg: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            servers: [cfg.get<string>('NATS_URL')!],
          },
        }),
      },
    ]),
  ],
  controllers: [AuthController, EventController, RewardController],
  providers: [JwtAuthGuard, RolesGuard, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class GatewayModule {}
