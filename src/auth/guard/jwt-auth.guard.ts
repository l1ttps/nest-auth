import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import AuthService from '../auth.service';
import { JwtStrategy } from './jwt.strategy';

const keyPublicRoute = 'isPublic';
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector, private authService: AuthService) {}

  private async validateRequest(request): Promise<boolean> {
    const headers = request.headers;
    const token = headers.authorization || null;
    if (!token) return false;
    const checkDeviceId = request.fingerprint.hash;
    const deviceId = JwtStrategy.getPayload(request.headers)['deviceId'];

    if (checkDeviceId !== deviceId) {
      throw new UnauthorizedException('Token not issued for this device');
    }
    try {
      const secretKey = await this.authService.getSecretKey(request);
      return !!JwtStrategy.verify(token, secretKey);
    } catch (e) {
      return false;
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.reflector.get(keyPublicRoute, context.getHandler())) return true;

    const request = context.switchToHttp().getRequest();

    if (!(await this.validateRequest(request))) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
export const JwtPublic = () => SetMetadata(keyPublicRoute, true);
