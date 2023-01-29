import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import DeviceSessionEntity from './device-session.entity';
import { DeviceSessionsService } from './device-sessions.service';

@ApiTags('device-sessions')
@Controller('device-sessions')
export class DeviceSessionsController {
  constructor(private readonly deviceSessionsService: DeviceSessionsService) {}

  @Get('')
  async getDeviceSessions(): Promise<DeviceSessionEntity[]> {
    return this.deviceSessionsService.getDeviceSessions();
  }
}
