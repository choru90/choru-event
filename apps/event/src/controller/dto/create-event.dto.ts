import { RewardType } from '../../entity/reward.entity';

export class CreateEventDto {
  title!: string;
  description?: string;
  startDate!: string;
  endDate!: string;
  completeCount: number;
  rewardList: CreateRewardContract[];
}

export class CreateRewardContract {
  eventId: string;
  type: RewardType;
  name: string;
  description?: string;
  amount: number;
}
