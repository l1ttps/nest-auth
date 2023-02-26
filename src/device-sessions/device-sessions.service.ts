import {
  CACHE_MANAGER,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';

import { Cache } from 'cache-manager';
import * as randomatic from 'randomatic';
import AuthService from 'src/auth/auth.service';
import { JwtStrategy } from 'src/auth/guard/jwt.strategy';
import addDay from 'src/helpers/addDay';
import { LoginMetadata } from 'src/users/users.controller';
import { Repository } from 'typeorm';
import DeviceSessionEntity from './device-session.entity';
const { randomUUID } = require('crypto');
const EXP_SESSION = 7; // 1 week
export interface LoginRespionse {
  token: string;
  refreshToken: string;
  expiredAt: Date;
}
@ApiBearerAuth()
@Injectable()
export class DeviceSessionsService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    @InjectRepository(DeviceSessionEntity)
    private repository: Repository<DeviceSessionEntity>,
    private authService: AuthService,
  ) {}

  generateSecretKey(length = 16) {
    return randomatic('A0', length);
  }

  async logout(userId: string, sessionId: string) {
    const session: any = await this.repository
      .createQueryBuilder('session')
      .leftJoinAndSelect('session.user', 'user')
      .select(['session', 'user.id'])
      .where('session.id = :sessionId', { sessionId })
      .getOne();

    if (!session || session.user.id !== userId) {
      throw new ForbiddenException();
    }
    const keyCache = this.authService.getKeyCache(userId, session.deviceId);

    await this.cacheManager.set(keyCache, null);
    await this.repository.delete(sessionId);
    return {
      message: 'Logout success',
      status: 200,
      sessionId,
    };
  }

  async reAuth(
    deviceId: string,
    _refreshToken: string,
  ): Promise<LoginRespionse> {
    const session: any = await this.repository
      .createQueryBuilder('session')
      .select('session', 'user.id')
      .leftJoinAndSelect('session.user', 'user')
      .where('session.refreshToken = :_refreshToken', { _refreshToken })
      .andWhere('session.deviceId = :deviceId', { deviceId })
      .getOne();

    if (
      !session ||
      new Date(session.expiredAt).valueOf() < new Date().valueOf()
    ) {
      throw new UnauthorizedException('Refresh token invalid');
    }

    const payload = {
      id: session.user.id,
      deviceId,
    };

    const secretKey = this.generateSecretKey();
    const [token, refreshToken, expiredAt] = [
      JwtStrategy.generate(payload, secretKey),
      randomatic('Aa0', 64),
      addDay(7),
    ];

    await this.repository.update(session.id, {
      secretKey,
      refreshToken,
      expiredAt,
    });
    return { token, refreshToken, expiredAt };
  }

  async handleDeviceSession(
    userId: string,
    metaData: LoginMetadata,
  ): Promise<LoginRespionse> {
    const { deviceId } = metaData;
    const currentDevice = await this.repository.findOne({
      where: { deviceId },
    });

    const expiredAt = addDay(EXP_SESSION);
    const secretKey = this.generateSecretKey();

    const payload = {
      id: userId,
      deviceId,
    };
    const [token, refreshToken] = [
      JwtStrategy.generate(payload, secretKey),
      randomatic('Aa0', 64),
    ];

    const deviceName = metaData.deviceId;
    const newDeviceSession = new DeviceSessionEntity();
    newDeviceSession.user = userId;
    newDeviceSession.secretKey = secretKey;
    newDeviceSession.refreshToken = refreshToken;
    newDeviceSession.expiredAt = expiredAt;
    newDeviceSession.deviceId = deviceId;
    newDeviceSession.ipAddress = metaData.ipAddress;
    newDeviceSession.ua = metaData.ua;
    newDeviceSession.name = deviceName;

    // update or create device session
    await this.repository.save({
      id: currentDevice?.id || randomUUID(),
      ...newDeviceSession,
    });
    return { token, refreshToken, expiredAt };
  }

  async getDeviceSessions(userId: string) {
    return this.repository.find({
      where: {
        user: userId,
      },
      select: [
        'id',
        'deviceId',
        'createdAt',
        'ipAddress',
        'name',
        'ua',
        'expiredAt',
        'updatedAt',
      ],
    });
  }
}
