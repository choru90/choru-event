import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateEventDto, CreateRewardContract } from './dto/create-event.dto';
import { EventService } from '../service/event.service';
import { RewardRequestDto } from './dto/reward-request.dto';
import { UpdateProgressContract } from './dto/update-progress.contract';

@Controller()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @MessagePattern('event_create')
  async create(@Payload() dto: CreateEventDto) {
    return this.eventService.createEvent(dto);
  }

  @MessagePattern('event_find_all')
  async findAll() {
    return await this.eventService.findAllEvents();
  }

  @MessagePattern('event_find_one')
  async findOne(@Payload() id: string) {
    return await this.eventService.findEventById(id);
  }

  @MessagePattern('reward_create')
  async createReward(@Payload() dto: CreateRewardContract) {
    return await this.eventService.addReward(dto);
  }

  @MessagePattern('reward_find_by_event')
  async findRewards(@Payload() eventId: string) {
    return await this.eventService.findRewards(eventId);
  }

  @MessagePattern('reward_request')
  async rewardRequest(@Payload() dto: RewardRequestDto) {
    return await this.eventService.requestReward(dto);
  }

  @MessagePattern('reward_request_history')
  async getRequestHistory(@Payload() userId: string) {
    return await this.eventService.getUserRequests(userId);
  }

  @MessagePattern('reward_request_history_all')
  async getRequestHistoryAll() {
    return await this.eventService.getAllRequests();
  }

  @MessagePattern('event_update_progress')
  async updateProgress(
    @Payload() dto: UpdateProgressContract,
  ): Promise<boolean> {
    await this.eventService.updateProgress(dto);
    return true;
  }
}
