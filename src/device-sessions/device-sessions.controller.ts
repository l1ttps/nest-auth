import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeviceSessionsService } from './device-sessions.service';

@ApiTags('device-sessions')
@Controller('device-sessions')
export class DeviceSessionsController {
  constructor(private readonly deviceSessionsService: DeviceSessionsService) {}
}
