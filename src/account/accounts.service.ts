import { SendMailService } from '../services/mail';
import { CacheService } from '../services/caching';
import { Account } from './account.entity';
import { LoginDto } from './dto/accounts.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Jwt from 'src/services/jwt-passport';
import * as bcrypt from 'bcrypt';
interface LoginResponse {
    id: string,
    email: string,
    token: string,
    refreshToken: string
}
const TTL_TOKEN = 1
const TTL_RFTOKEN = 30
@Injectable()
export class AccountService {
    constructor(@InjectRepository(Account) private repository: Repository<Account>,
        private cacheService: CacheService,
        private sendMailService: SendMailService
    ) { }

    async login(loginDto: LoginDto): Promise<LoginResponse> {
        const { email, password } = loginDto
        const account = await this.repository.findOne({ email })
        if (!!account && account.password === await bcrypt.hash(password, account.salt)) {
            return this.loginResponse(account)
        }
        throw new UnauthorizedException()
    }
    loginResponse(account: Account) {
        return {
            id: account.id,
            email: account.email,
            token: Jwt.generate(account.id, account.secretKey, TTL_TOKEN),
            refreshToken: Jwt.generate(account.id, account.secretKeyRft, TTL_RFTOKEN),
        }
    }
}
