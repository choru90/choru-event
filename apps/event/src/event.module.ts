// apps/event/src/event.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Event } from './entity/event.entity';
import { RewardRequest } from './entity/reward-request.entity';
import { EventController } from './controller/event.controller';
import { EventService } from './service/event.service';
import { MongoDriver } from '@mikro-orm/mongodb';
import { UserEvent } from './entity/user-event.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    MikroOrmModule.forRoot({
      driver: MongoDriver,
      clientUrl: process.env.MONGO_URI!,
      dbName: process.env.AUTH_DB_NAME ?? 'event_db',
      entities: [Event, RewardRequest, UserEvent],
      ensureIndexes: true,
      debug: process.env.NODE_ENV !== 'production',
      allowGlobalContext: true,
    }),

    MikroOrmModule.forFeature({ entities: [Event, RewardRequest, UserEvent] }),
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
