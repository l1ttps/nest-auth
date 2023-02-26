import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import AuthService from 'src/auth/auth.service';
import { UserEntity } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import DeviceSessionEntity from './device-session.entity';
import { DeviceSessionsController } from './device-sessions.controller';
import { DeviceSessionsService } from './device-sessions.service';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceSessionEntity, UserEntity])],
  controllers: [DeviceSessionsController],
  providers: [DeviceSessionsService, AuthService, UsersService],
})
export class DeviceSessionsModule {}
