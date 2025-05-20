import { ObjectId } from 'mongodb';
import { RewardType } from '../../../../../event/src/entity/reward.entity';

export class EventDto {
  _id!: ObjectId;
  title!: string;
  description?: string;
  startDate!: string;
  endDate!: string;
  completeCount?: number;
  rewards?: RewardDto[];
  createdAt!: Date;
  updatedAt!: Date;
}

export class RewardDto {
  _id!: ObjectId;
  type: RewardType;
  name: string;
  amount: number;
  createdAt: Date;
}
