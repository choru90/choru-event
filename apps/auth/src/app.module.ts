import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroConfig from '../../../mikro-orm.config';

console.log('MONGO_URI=', process.env.MONGO_URI);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', 'apps/auth/src/.env'],
    }),
    MikroOrmModule.forRoot(mikroConfig),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
