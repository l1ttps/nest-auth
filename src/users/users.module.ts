import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeaderHandlerService } from 'src/auth/guard/headerHandler';
import DeviceSessionEntity from 'src/device-sessions/device-session.entity';
import { DeviceSessionsService } from 'src/device-sessions/device-sessions.service';
import { UserEntity } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, DeviceSessionEntity])],
  controllers: [UsersController],
  providers: [UsersService, DeviceSessionsService, HeaderHandlerService],
})
export class UsersModule {}
