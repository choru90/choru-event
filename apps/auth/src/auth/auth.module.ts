import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MongoDriver } from '@mikro-orm/mongodb';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entity/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MikroOrmModule.forRoot({
      driver: MongoDriver,
      clientUrl: process.env.MONGO_URI!,
      dbName: process.env.AUTH_DB_NAME ?? 'auth_db',
      entities: [User],
      ensureIndexes: true,
      debug: process.env.NODE_ENV !== 'production',
      allowGlobalContext: true,
    }),
    MikroOrmModule.forFeature({ entities: [User] }),
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.get<string>('JWT_SECRET')!,
        signOptions: { expiresIn: cfg.get<string>('JWT_EXPIRES_IN') },
      }),
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
