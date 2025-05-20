// apps/<service>/src/main.ts
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

async function bootstrap() {
  const appCtx = await NestFactory.createApplicationContext(AuthModule);
  const config = appCtx.get<ConfigService>(ConfigService);

  const natsUrl = config.get<string>('NATS_URL');
  if (!natsUrl) throw new Error('NATS_URL이 설정되어 있지 않습니다.');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.NATS,
      options: {
        servers: [natsUrl],
      },
    },
  );

  await app.listen();
}

bootstrap();
