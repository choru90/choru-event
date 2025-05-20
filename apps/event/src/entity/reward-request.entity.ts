import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectId } from 'mongodb';
import { RewardRequestDto } from '../controller/dto/reward-request.dto';

/** 요청 상태 (Pending, Approved, Rejected 등) */
export enum RequestStatus {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity()
export class RewardRequest {
  @PrimaryKey()
  private _id!: ObjectId;

  @Property()
  userId!: string;

  @Property()
  eventId!: string;

  @Property()
  rewardId!: string;

  @Enum(() => RequestStatus)
  private status: RequestStatus = RequestStatus.REJECTED;

  @Property()
  requestedAt: Date = new Date();

  public static createRejected(dto: RewardRequestDto): RewardRequest {
    const rewardRequest = new RewardRequest();
    rewardRequest.userId = dto.userId;
    rewardRequest.eventId = dto.eventId;
    rewardRequest.rewardId = dto.rewardId;
    rewardRequest.status = RequestStatus.REJECTED;
    rewardRequest.requestedAt = new Date();
    return rewardRequest;
  }

  public static createApproved(dto: RewardRequestDto): RewardRequest {
    const rewardRequest = new RewardRequest();
    rewardRequest.userId = dto.userId;
    rewardRequest.eventId = dto.eventId;
    rewardRequest.rewardId = dto.rewardId;
    rewardRequest.status = RequestStatus.APPROVED;
    rewardRequest.requestedAt = new Date();
    return rewardRequest;
  }
}
