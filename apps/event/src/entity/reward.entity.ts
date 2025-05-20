import { Embeddable, Enum, Property } from '@mikro-orm/core';
import { CreateRewardContract } from '../controller/dto/create-event.dto';
import { ObjectId } from 'mongodb';
import { RewardDto } from '../controller/dto/event.dto';

export enum RewardType {
  POINT = 'POINT',
  COUPON = 'COUPON',
  ITEM = 'ITEM',
  CURRENCY = 'CURRENCY',
}

@Embeddable()
export class Reward {
  @Property()
  private _id!: ObjectId;

  @Enum(() => RewardType)
  private type!: RewardType;

  @Property()
  private name!: string;

  @Property({ nullable: true })
  private description?: string;

  @Property()
  private amount!: number;

  @Property()
  private createdAt: Date = new Date();

  public static create(dto: CreateRewardContract): Reward {
    const reward = new Reward();
    reward._id = new ObjectId();
    reward.type = dto.type;
    reward.name = dto.name;
    reward.description = dto.description;
    reward.amount = dto.amount;
    return reward;
  }

  getStringId(): string {
    return this._id.toString();
  }

  getRewardDto(): RewardDto {
    return {
      id: this.getStringId(),
      type: this.type,
      name: this.name,
      amount: this.amount,
      createdAt: this.createdAt.toISOString(),
    };
  }
}
