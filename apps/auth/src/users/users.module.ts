import { Module } from '@nestjs/common';
import { UsersService } from './service/users.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './entity/user.entity';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [User] })],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
