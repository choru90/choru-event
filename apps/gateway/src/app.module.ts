import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        imports: [ConfigModule],
        useFactory: (cfg: ConfigService) => ({
          transport: Transport.NATS,
          options: { url: cfg.get<string>('NATS_URL') },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
})
export class AppModule {}
