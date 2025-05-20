import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { CreateUserDto } from '../dto/create-user.dto';

@Entity({ collection: 'users' })
export class User {
  @PrimaryKey()
  _id: ObjectId;

  @Property({ unique: true })
  email!: string;

  @Property()
  password!: string;

  @Property()
  name!: string;

  @Property({ nullable: false })
  roles: string[] = ['USER'];

  @Property({ nullable: true, hidden: true })
  refreshTokenHash?: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  public static create(dto: CreateUserDto): User {
    const user = new User();
    user.name = dto.name;
    user.email = dto.email;
    user.password = dto.password;
    return user;
  }
}
