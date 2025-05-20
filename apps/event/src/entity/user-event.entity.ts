import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectId } from 'mongodb';
import { UpdateProgressContract } from '../controller/dto/update-progress.contract';

@Entity({ collection: 'user_events' })
export class UserEvent {
  @PrimaryKey()
  private readonly _id!: ObjectId;

  @Property()
  private userId!: string;

  @Property()
  private eventId!: string;

  @Property({ default: 0 })
  private successCount: number = 0;

  @Property()
  private lastParticipatedAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  private readonly updatedAt: Date = new Date();

  public static create(contract: UpdateProgressContract): UserEvent {
    const userEvent = new UserEvent();
    userEvent.userId = contract.userId;
    userEvent.eventId = contract.eventId;
    userEvent.successCount = 1;
    return userEvent;
  }

  getSuccessCount() {
    return this.successCount;
  }

  updateSuccessCount() {
    this.successCount += 1;
    this.lastParticipatedAt = new Date();
  }
}
