import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../../../gateway/src/controller/auth/dto/create-user.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository, ObjectId } from '@mikro-orm/mongodb';
import * as bcrypt from 'bcrypt';
import { User } from '../entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repository: EntityRepository<User>,
    private readonly em: EntityManager,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = await this.repository.findOne({ email: dto.email });
    if (user) {
      throw new ConflictException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const createdUser = User.create({
      ...dto,
      password: hashedPassword,
    });

    await this.em.persistAndFlush(createdUser);
    return createdUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ email });
  }

  async setCurrentRefreshToken(userId: string, hash: string) {
    const user = await this.repository.findOneOrFail({
      _id: new ObjectId(userId),
    });
    user.setRefreshToken(hash);
    await this.em.flush();
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({ _id: new ObjectId(id) });
  }
}
