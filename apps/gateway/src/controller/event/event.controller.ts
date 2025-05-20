import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CreateEventDto } from './dto/create-event.dto';
import { EventDto } from './dto/event.dto';
import { UpdateProgressContract } from '../../../../event/src/controller/dto/update-progress.contract';
import { JwtAuthGuard } from '../../guard/jwt-auth.gurad';
import { User } from '../../guard/user.decorator';
import { Roles } from '../../guard/roles.decorator';
import { RolesGuard } from '../../guard/roles.guard';

@UseGuards(JwtAuthGuard)
@Controller('event')
export class EventController {
  @Inject('EVENT_SERVICE')
  private readonly eventClient: ClientProxy;

  @UseGuards(RolesGuard)
  @Roles('OPERATOR', 'ADMIN')
  @Post()
  createEvent(@Body() dto: CreateEventDto): Promise<EventDto> {
    return lastValueFrom(
      this.eventClient.send<EventDto, CreateEventDto>('event_create', dto),
    );
  }

  @Get()
  async findAllEvents(): Promise<EventDto[]> {
    return lastValueFrom(
      this.eventClient.send<EventDto[], any>('event_find_all', {}),
    );
  }

  @Get(':id')
  findEventById(@Param('id') id: string): Promise<EventDto> {
    return lastValueFrom(
      this.eventClient.send<EventDto, string>('event_find_one', id),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':eventId/progress')
  async incrementSuccess(
    @User('userId') userId: string,
    @Param('eventId') eventId: string,
  ) {
    const dto: UpdateProgressContract = { userId, eventId };
    await lastValueFrom(
      this.eventClient.send<boolean, UpdateProgressContract>(
        'event_update_progress',
        dto,
      ),
    );
    return { status: 'ok' };
  }
}
