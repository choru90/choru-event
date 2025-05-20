import { IsString } from 'class-validator';

export class RewardRequestDto {
  @IsString()
  userId!: string;
  @IsString()
  eventId!: string;
  @IsString()
  rewardId!: string;
}
