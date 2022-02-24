import { Account } from './../account/account.entity';
import { AuthGuard, Public } from './../services/guard';
import { GetOTPSignUpDto, LoginDto, SignupDto, UpdateProfileDto } from './../account/dto/accounts.dto';
import { AccountService } from './../account/accounts.service';
import { HeaderHandlerService } from './../services/headerHandler';
import { Body, Controller, Post, UseGuards, Get, NotFoundException, Headers, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('accounts')
@ApiBearerAuth()
@ApiTags('accounts')
@UseGuards(AuthGuard)
@UseGuards(ThrottlerGuard)
export class AccountsController {
    constructor(
        private accountService: AccountService,
        private headerHandlerService: HeaderHandlerService,
    ) { }

    @Post("signup/otp")
    @Public()
    async getOTPSignUp(@Body() getOTP: GetOTPSignUpDto) {
        return this.accountService.getOTPSignup(getOTP.email)
    }

    @Post("signup")
    @Public()
    async signup(@Body() signupDto: SignupDto) {
        return this.accountService.signup(signupDto)
    }

    @Post("login")
    @Public()
    async login(@Body() loginDto: LoginDto): Promise<{}> {
        return this.accountService.login(loginDto)
    }

    @Get("profile")
    async profile(@Headers() headers) {
        const userId = this.headerHandlerService.getUserId(headers)
        if (!userId) throw new NotFoundException()
        return this.accountService.getProfile(userId)
    }


    @Patch("profile")
    async updateProfile(@Body() body: UpdateProfileDto, @Headers() headers): Promise<Account> {
        const userId = this.headerHandlerService.getUserId(headers)
        if (!userId) throw new NotFoundException()
        return this.accountService.updateProfile(body, userId)
    }

}
