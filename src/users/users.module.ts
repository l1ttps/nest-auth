import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import AuthService from 'src/auth/auth.service';
import DeviceSessionEntity from 'src/device-sessions/device-session.entity';
import { DeviceSessionsService } from 'src/device-sessions/device-sessions.service';
import { UserEntity } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, DeviceSessionEntity])],
  controllers: [UsersController],
  providers: [UsersService, DeviceSessionsService, AuthService],
})
export class UsersModule {}
