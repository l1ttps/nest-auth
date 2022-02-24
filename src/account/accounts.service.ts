import { SignupDto, UpdateProfileDto } from './../account/dto/accounts.dto';
import { SendMailService } from '../services/mail';
import { CacheService } from '../services/caching';
import { Account } from './account.entity';
import { LoginDto } from './dto/accounts.dto';
import { BadGatewayException, BadRequestException, ConflictException, ForbiddenException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Jwt from 'src/services/jwt-passport';
import * as bcrypt from 'bcrypt';
import * as md5 from "md5";
import * as generateToken from "rand-token";
interface LoginResponse {
    id: string,
    email: string,
    token: string,
    refreshToken: string
}
const TTL_TOKEN = 1
const TTL_RFTOKEN = 30
const excludeFields = ["secretKey", "password", "secretKeyRft", "salt"]

@Injectable()
export class AccountService {
    constructor(@InjectRepository(Account) private repository: Repository<Account>,
        private cacheService: CacheService,
        private sendMailService: SendMailService
    ) { }

    async getProfile(id: string) {
        try {
            const data = await this.repository.findOne(id)
            if (!!data) return this.responseUserData(data)
            throw new ForbiddenException()
        }
        catch (e) {
            throw new ForbiddenException()
        }
    }

    responseUserData = (data: Account) => {
        Object.keys(data).forEach((field: string) => {
            if (excludeFields.some((excludeField => excludeField === field))) delete data[`${field}`]
        })
        return data
    }


    async updateProfile(updateProfileDto: UpdateProfileDto, id: string): Promise<Account> {
        try {
            let oldUserData = await this.repository.findOne(id)
            console.log(updateProfileDto);

            return oldUserData


        }
        catch (e) {
            throw new BadRequestException(e.message)
        }
    }

    async getOTPSignup(email: string) {
        var randomize = require('randomatic');
        const keyCache = md5(email)
        if (!!(await this.repository.count({ where: { email: email } }))) throw new ConflictException("This email address is already used. Try a different email address.")


        if (this.cacheService.has(keyCache)) throw new HttpException("Too many request", HttpStatus.TOO_MANY_REQUESTS)

        const verifyCode = randomize('0', 6)
        const verifyCodeMd5 = md5(verifyCode)
        try {
            await this.sendMailService.sendOTPSignUp(`${verifyCode}`, email)
            this.cacheService.set(keyCache, verifyCodeMd5, 120)
            return { message: `An email has been sent to ${email}` }
        }
        catch (e) {
            throw new BadGatewayException()
        }
    }

    async signup(newAccount: SignupDto): Promise<{}> {
        const { email, password } = newAccount
        const account = new Account
        const keyCache = md5(email)
        const cacheValueOTPSignup = this.cacheService.get(keyCache)
        if (!cacheValueOTPSignup) {
            throw new UnauthorizedException()
        }
        else {
            if (md5(newAccount.verifyCode) === cacheValueOTPSignup) {
                Object.assign(account, { email })
                account.salt = await bcrypt.genSalt();
                account.password = await bcrypt.hash(password, account.salt)
                account.secretKey = generateToken.uid(9)
                account.secretKeyRft = generateToken.uid(9)
                try {
                    await this.repository.save(account)
                    return { message: "success" }
                }
                catch (e) {
                    throw new HttpException(e.detail, HttpStatus.BAD_REQUEST);
                }
            }
            else {
                throw new UnauthorizedException("Verify code incorrect")
            }
        }

    }

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
