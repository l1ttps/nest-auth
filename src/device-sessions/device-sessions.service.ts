import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as randomatic from 'randomatic';
import { JwtStrategy } from 'src/auth/guard/jwt.strategy';
import { LoginMetadata } from 'src/users/users.controller';
import { Repository } from 'typeorm';
import DeviceSessionEntity from './device-session.entity';
const UAParser = require('ua-parser-js');
const sha256 = require('crypto-js/sha256');
const { randomUUID } = require('crypto');

@Injectable()
export class DeviceSessionsService {
  constructor(
    @InjectRepository(DeviceSessionEntity)
    private repository: Repository<DeviceSessionEntity>,
  ) {}

  generateSecretKey(length = 16) {
    return randomatic('A0', length);
  }

  generateDeviceId(userId: string, metaData: LoginMetadata) {
    return sha256(`${userId}-${metaData.ipAddress}-${metaData.ua}`).toString();
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
    const deviceId = this.generateDeviceId(userId, metaData);
    const currentDevice = await this.repository.findOne({
      where: { deviceId },
    });

    const expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + 7);
    const secretKey = this.generateSecretKey();

    const payload = {
      id: userId,
      deviceId,
    };
    const [token, refreshToken] = [
      JwtStrategy.generate(payload, secretKey),
      randomatic('Aa0', 64),
    ];
    const uaParser = new UAParser(metaData.ua);
    const parserResults = uaParser.getResult();
    const deviceName = `${parserResults.browser.name}_${parserResults.browser.version}`;
    const newDeviceSession = new DeviceSessionEntity();

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
}
