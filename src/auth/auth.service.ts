import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import DeviceSessionEntity from 'src/device-sessions/device-session.entity';
import { Repository } from 'typeorm';
import { HeaderHandlerService } from './guard/headerHandler';

@Injectable()
export default class AuthService {
  constructor(
    @InjectRepository(DeviceSessionEntity)
    private deviceSessionsRepository: Repository<DeviceSessionEntity>,
    private headerHandlerService: HeaderHandlerService,
  ) {}

  async getSecretKey(headers) {
    const [deviceId, userId] = [
      this.headerHandlerService.getDeviceId(headers),
      this.headerHandlerService.getUserId(headers),
    ];

    const { secretKey } = await this.deviceSessionsRepository
      .createQueryBuilder('deviceSessions')
      .where('deviceSessions.deviceId = :deviceId', { deviceId })
      .andWhere('deviceSessions.userId = :userId', { userId })
      .getOne();

    return secretKey;
  }
}
