import { Embedded, Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectId } from 'mongodb';
import { Reward } from './reward.entity';
import {
  CreateEventDto,
  CreateRewardContract,
} from '../controller/dto/create-event.dto';
import { NotFoundException } from '@nestjs/common';

@Entity({ collection: 'events' })
export class Event {
  @PrimaryKey()
  private readonly _id!: ObjectId;

  @Property()
  private title!: string;

  @Property({ nullable: true })
  private description?: string;

  @Property()
  private startDate!: Date;

  @Property()
  private endDate!: Date;

  @Property({ default: false })
  private isActive: boolean = false;

  @Property()
  private completeCount: number;

  @Embedded(() => Reward, { array: true })
  private rewards: Reward[] = [];

  @Property()
  private readonly createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  private readonly updatedAt: Date = new Date();

  public static create(dto: CreateEventDto): Event {
    const event = new Event();
    event.title = dto.title;
    event.description = dto.description;
    event.startDate = new Date(dto.startDate);
    event.endDate = new Date(dto.endDate);
    event.completeCount = dto.completeCount;
    event.rewards = dto.rewardList
      ? dto.rewardList.map((rewardDto) => Reward.create(rewardDto))
      : [];
    return event;
  }

  addReward(rewardContract: CreateRewardContract) {
    const reward = Reward.create(rewardContract);
    if (this.rewards) {
      this.rewards.push(reward);
    } else {
      this.rewards = [reward];
    }
  }

  getRewards(): Reward[] {
    return this.rewards;
  }

  validateRewardId(rewardId: string): void {
    const reward = this.rewards.find(
      (reward) => reward.getStringId() === rewardId,
    );
    if (!reward)
      throw new NotFoundException(`Reward ${rewardId} not found in event`);
  }

  isCompleted(completeCount: number): boolean {
    return completeCount >= this.completeCount;
  }

  getEventDto() {
    return {
      title: this.title,
      startDate: this.startDate.toISOString(),
      endDate: this.endDate.toISOString(),
      isActive: this.isActive,
      completeCount: this.completeCount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      id: this._id.toString(),
      rewards: this.rewards?.map((reward) => reward.getRewardDto()) ?? [],
    };
  }
}
