import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { CreateUserDto } from '../../../../gateway/src/controller/auth/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

export enum ROLE {
  USER = 'USER',
  OPERATOR = 'OPERATOR',
  AUDITOR = 'AUDITOR',
  ADMIN = 'ADMIN',
}

@Entity({ collection: 'users' })
export class User {
  @PrimaryKey()
  private _id: ObjectId;

  @Property({ unique: true })
  private email!: string;

  @Property()
  private password!: string;

  @Property()
  private name!: string;

  @Property({ nullable: false })
  private roles: ROLE[] = [ROLE.USER];

  @Property({ nullable: true, hidden: true })
  private refreshTokenHash?: string;

  @Property()
  private createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  private updatedAt: Date = new Date();

  static create(dto: CreateUserDto): User {
    const user = new User();
    user.name = dto.name;
    user.email = dto.email;
    user.password = dto.password;
    user.roles = dto.roles;
    return user;
  }

  validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  async validateRefreshToken(refreshToken: string) {
    if (!this.refreshTokenHash) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const valid = await bcrypt.compare(refreshToken, this.refreshTokenHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  getPayload() {
    return {
      userId: this._id.toString(),
      email: this.email,
      roleList: this.roles,
    };
  }

  getStringId() {
    return this._id.toString();
  }

  setRefreshToken(refreshToken: string) {
    this.refreshTokenHash = refreshToken;
  }

  getUserInfo() {
    return {
      email: this.email,
      name: this.name,
      roles: this.roles,
    };
  }
}
