import { RewardType } from '../../entity/reward.entity';

export interface EventDto {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  completeCount: number;
  rewards: RewardDto[];
}

export interface RewardDto {
  id: string;
  name: string;
  type: RewardType;
  amount: number;
  createdAt: string;
}
