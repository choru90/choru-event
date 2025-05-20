import { IsString } from 'class-validator';

export class RewardRequestDto {
  @IsString()
  eventId!: string;

  @IsString()
  rewardId!: string;
}
