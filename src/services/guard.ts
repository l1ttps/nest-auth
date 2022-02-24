import { HeaderHandlerService } from './headerHandler';
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import Jwt from './jwt-passport';

const keyPublicRoute = "isPublic"
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private headerHandlerService: HeaderHandlerService
    ) { }

    private async validateRequest(request): Promise<boolean> {
        const headers = request.headers
        const token = headers.authorization || null

        if (!token) return false
        try {
            const secretKey = await this.headerHandlerService.getSecretKey(headers)
            return !!Jwt.verify(token, secretKey)
        }
        catch (e) {
            return false
        }
    }



    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        if (this.reflector.get(keyPublicRoute, context.getHandler())) return true

        const request = context.switchToHttp().getRequest();
        const validateRequest = await this.validateRequest(request);
        if (!validateRequest) {
            throw new UnauthorizedException()
        }
        return true
    }

}
export const Public = () => SetMetadata(keyPublicRoute, true);