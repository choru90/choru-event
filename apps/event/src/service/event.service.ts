import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import {
  CreateEventDto,
  CreateRewardContract,
} from '../controller/dto/create-event.dto';
import { Event } from '../entity/event.entity';
import { EntityManager, ObjectId } from '@mikro-orm/mongodb';
import { RewardRequestDto } from '../controller/dto/reward-request.dto';
import { RewardRequest } from '../entity/reward-request.entity';
import { UserEvent } from '../entity/user-event.entity';
import { UpdateProgressContract } from '../controller/dto/update-progress.contract';
import { EventDto, RewardDto } from '../controller/dto/event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly repository: EntityRepository<Event>,
    @InjectRepository(RewardRequest)
    private readonly rewardRequestRepository: EntityRepository<RewardRequest>,
    @InjectRepository(UserEvent)
    private readonly userEventRepository: EntityRepository<UserEvent>,
    private readonly em: EntityManager,
  ) {}

  async createEvent(dto: CreateEventDto): Promise<EventDto> {
    const event = this.repository.create(Event.create(dto));
    await this.em.persistAndFlush(event);
    return event.getEventDto();
  }

  async findAllEvents(): Promise<EventDto[]> {
    const eventList = await this.repository.findAll();
    return eventList.map((event: Event) => event.getEventDto());
  }

  async findEventById(id: string): Promise<EventDto> {
    const event = await this.repository.findOne({
      _id: new ObjectId(id),
    });
    if (!event) throw new NotFoundException(`Event ${id} not found`);
    return event.getEventDto();
  }

  async addReward(dto: CreateRewardContract): Promise<RewardDto[]> {
    const event = await this.repository.findOne(dto.eventId);
    if (!event) throw new NotFoundException(`Event ${dto.eventId} not found`);

    event.addReward(dto);

    await this.em.flush();
    return event.getRewards().map((reward) => reward.getRewardDto());
  }

  async findRewards(eventId: string): Promise<RewardDto[]> {
    const event = await this.repository.findOne(eventId);
    if (!event) throw new NotFoundException(`Event ${eventId} not found`);
    return event.getRewards().map((reward) => reward.getRewardDto());
  }

  async requestReward(dto: RewardRequestDto): Promise<RewardRequest> {
    const event = await this.repository.findOne(dto.eventId);
    if (!event) throw new NotFoundException(`Event ${dto.eventId} not found`);
    event.validateRewardId(dto.rewardId);
    const existing = await this.rewardRequestRepository.findOne({
      userId: dto.userId,
      eventId: dto.eventId,
      rewardId: dto.rewardId,
    });
    if (existing) {
      throw new ConflictException(
        `Reward ${dto.rewardId} already requested by user`,
      );
    }

    const userEvent = await this.userEventRepository.findOne({
      userId: dto.userId,
      eventId: dto.eventId,
    });
    let req: RewardRequest;
    if (!userEvent || !event.isCompleted(userEvent.getSuccessCount())) {
      req = this.rewardRequestRepository.create(
        RewardRequest.createRejected(dto),
      );
    } else {
      req = this.rewardRequestRepository.create(
        RewardRequest.createApproved(dto),
      );
    }

    await this.em.persistAndFlush(req);
    return req;
  }

  async getUserRequests(userId: string): Promise<RewardRequest[]> {
    return this.rewardRequestRepository.find(
      { userId },
      { orderBy: { requestedAt: 'DESC' } },
    );
  }

  async getAllRequests(): Promise<RewardRequest[]> {
    return this.rewardRequestRepository.findAll({
      orderBy: { requestedAt: 'DESC' },
    });
  }

  async updateProgress(dto: UpdateProgressContract): Promise<void> {
    let userEvent = await this.userEventRepository.findOne({
      userId: dto.userId,
      eventId: dto.eventId,
    });

    if (!userEvent) {
      userEvent = this.userEventRepository.create(UserEvent.create(dto));
    } else {
      userEvent.updateSuccessCount();
    }

    await this.em.persistAndFlush(userEvent);
  }
}
