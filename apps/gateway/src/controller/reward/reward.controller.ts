import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { EventDto } from '../event/dto/event.dto';
import { Reward } from '../../../../event/src/entity/reward.entity';
import { CreateRewardDto } from '../event/dto/create-event.dto';
import { CreateRewardContract } from '../../../../event/src/controller/dto/create-event.dto';
import { RewardRequestDto } from '../../../../event/src/controller/dto/reward-request.dto';
import { JwtAuthGuard } from '../../guard/jwt-auth.gurad';
import { RolesGuard } from '../../guard/roles.guard';
import { Roles } from '../../guard/roles.decorator';
import { User } from '../../guard/user.decorator';
import { RewardRequest } from '../../../../event/src/entity/reward-request.entity';

@UseGuards(JwtAuthGuard)
@Controller()
export class RewardController {
  @Inject('EVENT_SERVICE')
  private readonly eventClient: ClientProxy;

  @UseGuards(RolesGuard)
  @Roles('OPERATOR', 'ADMIN')
  @Post('event/:id/rewards')
  createReward(@Param('id') eventId: string, @Body() dto: CreateRewardDto) {
    return lastValueFrom(
      this.eventClient.send<Reward[], CreateRewardContract>('reward_create', {
        eventId: eventId,
        ...dto,
      }),
    );
  }

  @Get('event/:id/rewards')
  listRewards(@Param('id') eventId: string) {
    return lastValueFrom(
      this.eventClient.send<EventDto, string>('reward_find_by_event', eventId),
    );
  }

  @Post('events/:id/rewards/:rid/request')
  requestReward(
    @Param('id') eventId: string,
    @Param('rid') rewardId: string,
    @User('userId') userId: string,
  ) {
    return lastValueFrom(
      this.eventClient.send<RewardRequest, RewardRequestDto>('reward_request', {
        userId,
        eventId,
        rewardId,
      }),
    );
  }

  @Get('users/rewards/requests')
  listMyRequests(@User('userId') userId: string) {
    return lastValueFrom(
      this.eventClient.send<RewardRequest[], string>(
        'reward_request_history',
        userId,
      ),
    );
  }

  @Get('rewards/requests')
  @UseGuards(RolesGuard)
  @Roles('AUDITOR', 'ADMIN')
  listAllRequests() {
    return lastValueFrom(
      this.eventClient.send<RewardRequest[], any>(
        'reward_request_history_all',
        {},
      ),
    );
  }
}
