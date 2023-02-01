import { Injectable } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';

@Injectable()
export class HeaderHandlerService {
  public getUserId = (headers): string => {
    return headers.authorization
      ? JwtStrategy.decode(headers.authorization)['id']
      : null;
  };

  public getDeviceId = (headers): string => {
    return headers.authorization
      ? JwtStrategy.decode(headers.authorization)['deviceId']
      : null;
  };
}
