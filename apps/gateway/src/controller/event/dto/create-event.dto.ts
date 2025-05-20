import { RewardType } from '../../../../../event/src/entity/reward.entity';

export class CreateEventDto {
  title!: string;
  description?: string;
  startDate!: string;
  endDate!: string;
  completeCount?: number;
  rewardList?: CreateRewardDto[];
}

export class CreateRewardDto {
  type: RewardType;
  name: string;
  description?: string;
  amount: number;
}
