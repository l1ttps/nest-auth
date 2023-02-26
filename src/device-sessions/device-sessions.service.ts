import { ForbiddenException, Injectable } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';

import * as randomatic from 'randomatic';
import AuthService from 'src/auth/auth.service';
import { JwtStrategy } from 'src/auth/guard/jwt.strategy';
import addDay from 'src/helpers/addDay';
import { LoginMetadata } from 'src/users/users.controller';
import { Repository } from 'typeorm';
import DeviceSessionEntity from './device-session.entity';
const UAParser = require('ua-parser-js');
const sha256 = require('crypto-js/sha256');
const { randomUUID } = require('crypto');
const EXP_SESSION = 7; // 1 week

@ApiBearerAuth()
@Injectable()
export class DeviceSessionsService {
  constructor(
    // @Inject(CACHE_MANAGER)
    // private cacheManager: Cache,
    @InjectRepository(DeviceSessionEntity)
    private repository: Repository<DeviceSessionEntity>,
    private authService: AuthService,
  ) {}

  generateSecretKey(length = 16) {
    return randomatic('A0', length);
  }

  async logout(userId: string, sessionId: string) {
    const session = await this.repository.findOne({
      where: {
        user: userId,
        id: sessionId,
      },
    });
    console.log(session);

    if (!session) {
      throw new ForbiddenException();
    }
    const keyCache = this.authService.getKeyCache(userId, session.deviceId);
    console.log(keyCache);

    await this.repository.delete(sessionId);
    return {
      message: 'Logout success',
      status: 200,
      sessionId,
    };
  }

  async handleDeviceSession(
    userId: string,
    metaData: LoginMetadata,
  ): Promise<{
    token: string;
    refreshToken: string;
    expiredAt: Date;
    deviceId: string;
  }> {
    const { deviceId } = metaData;
    const currentDevice = await this.repository.findOne({
      where: { deviceId },
    });

    const expiredAt = addDay(7);
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
    return { token, refreshToken, expiredAt, deviceId };
  }

  async getDeviceSessions() {
    return this.repository.find({
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
