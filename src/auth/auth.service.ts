import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import DeviceSessionEntity from 'src/device-sessions/device-session.entity';
import { DeviceSessionsService } from 'src/device-sessions/device-sessions.service';
import { Repository } from 'typeorm';
import { JwtStrategy } from './guard/jwt.strategy';

@Injectable()
export default class AuthService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    @InjectRepository(DeviceSessionEntity)
    private deviceSessionsRepository: Repository<DeviceSessionEntity>,
    private deviceSessionService: DeviceSessionsService,
  ) {}

  async getSecretKey(request): Promise<string> {
    const headers = request.headers;
    const payload = JwtStrategy.decode(headers.authorization);
    const { deviceId, id, exp } = payload;

    const keyCache = this.getKeyCache(id, deviceId);
    const secretKeyFromCache: string = await this.cacheManager.get(keyCache);

    if (secretKeyFromCache) return secretKeyFromCache;

    const { secretKey } = await this.deviceSessionsRepository
      .createQueryBuilder('deviceSessions')
      .where('deviceSessions.deviceId = :deviceId', { deviceId })
      .andWhere('deviceSessions.userId = :id', { id })
      .getOne();

    await this.cacheManager.set(
      keyCache,
      secretKey,
      (exp - Math.floor(Date.now() / 1000)) * 1000,
    );
    return secretKey;
  }

  getKeyCache(userId, deviceId): string {
    return `sk_${userId}_${deviceId}`;
  }
}
