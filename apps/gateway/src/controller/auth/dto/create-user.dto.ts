import { IsEmail, IsString, MinLength } from 'class-validator';
import { ROLE } from '../../../../../auth/src/users/entity/user.entity';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  name: string;

  roles: ROLE[];
}
