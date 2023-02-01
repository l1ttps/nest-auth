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
    try {
      const secretKey = await this.authService.getSecretKey(headers);
      return !!JwtStrategy.verify(token, secretKey);
    } catch (e) {
      return false;
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.reflector.get(keyPublicRoute, context.getHandler())) return true;

    const request = context.switchToHttp().getRequest();
    const validateRequest = await this.validateRequest(request);
    if (!validateRequest) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
export const JwtPublic = () => SetMetadata(keyPublicRoute, true);
