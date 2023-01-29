import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import DeviceSessionEntity from './device-session.entity';
import { DeviceSessionsController } from './device-sessions.controller';
import { DeviceSessionsService } from './device-sessions.service';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceSessionEntity])],
  controllers: [DeviceSessionsController],
  providers: [DeviceSessionsService],
})
export class DeviceSessionsModule {}
