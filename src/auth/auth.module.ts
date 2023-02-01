import { Module } from '@nestjs/common';
import { DeviceSessionsService } from 'src/device-sessions/device-sessions.service';
import { UsersModule } from 'src/users/users.module';
import { HeaderHandlerService } from './guard/headerHandler';

@Module({
  imports: [UsersModule],
  providers: [HeaderHandlerService, DeviceSessionsService],
})
export class AuthModule {}
