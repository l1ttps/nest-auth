import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import DeviceSessionEntity from './device-session.entity';
import { DeviceSessionsService } from './device-sessions.service';

@ApiTags('device-sessions')
@Controller('device-sessions')
@UseGuards(JwtAuthGuard)
export class DeviceSessionsController {
  constructor(private readonly deviceSessionsService: DeviceSessionsService) {}

  @Get('')
  async getDeviceSessions(): Promise<DeviceSessionEntity[]> {
    return this.deviceSessionsService.getDeviceSessions();
  }
}
