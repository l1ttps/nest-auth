import { CacheService } from './caching';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './../account/account.entity';
import { Repository } from 'typeorm';
import { Injectable } from "@nestjs/common";
import Jwt from "./jwt-passport";

@Injectable()
export class HeaderHandlerService {
    constructor(
        @InjectRepository(Account) private authRepository: Repository<Account>,
        private cacheService: CacheService
    ) { }
    public getUserId = (headers): string => headers.authorization ? Jwt.decode(headers.authorization).id : null
    public getSecretKey = async (headers): Promise<string> => {
        const userId = this.getUserId(headers)
        const secrecKeyFromCache = this.cacheService.get(`${userId}_secretKey`)

        if (!!secrecKeyFromCache) return secrecKeyFromCache

        const userData = await this.authRepository.findOne(userId, { select: ["secretKey"] })
        this.cacheService.set(`${userId}_secretKey`, userData.secretKey, 86400)
        return userData.secretKey
    }
}