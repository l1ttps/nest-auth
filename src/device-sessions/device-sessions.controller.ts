import { Controller, Get, UseGuards } from '@nestjs/common';
import { Body, Post } from '@nestjs/common/decorators';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UserId } from 'src/decorators/user.decorator';
import DeviceSessionEntity from './device-session.entity';
import { DeviceSessionsService } from './device-sessions.service';
import LogoutDto from './dto/logout.dto';

@ApiTags('device-sessions')
@ApiBearerAuth()
@Controller('device-sessions')
@UseGuards(JwtAuthGuard)
export class DeviceSessionsController {
  constructor(private readonly deviceSessionsService: DeviceSessionsService) {}

  @Get('')
  async getDeviceSessions(@UserId() userId): Promise<DeviceSessionEntity[]> {
    return this.deviceSessionsService.getDeviceSessions(userId);
  }

  @Post('logout')
  async logout(@UserId() userId, @Body() body: LogoutDto) {
    const { sessionId } = body;
    return this.deviceSessionsService.logout(userId, sessionId);
  }
}
