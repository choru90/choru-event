// apps/auth/src/main.ts  (event나 다른 서비스도 동일하게)
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from '../../auth/src/auth/auth.module';
import { EventModule } from './event.module';

async function bootstrap() {
  const appCtx = await NestFactory.createApplicationContext(AuthModule);
  const cfg = appCtx.get<ConfigService>(ConfigService);
  const natsUrl = cfg.get<string>('NATS_URL');
  if (!natsUrl) throw new Error('NATS_URL이 설정되어 있지 않습니다.');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    EventModule,
    {
      transport: Transport.NATS,
      options: {
        servers: [natsUrl],
      },
    },
  );

  await app.listen();
  console.log(`Auth 마이크로서비스가 NATS(${natsUrl})로 시작되었습니다.`);
}

bootstrap();
