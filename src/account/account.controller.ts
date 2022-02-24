import { AuthGuard, Public } from './../services/guard';
import { GetOTPSignUpDto, LoginDto, SignupDto } from './../account/dto/accounts.dto';
import { AccountService } from './../account/accounts.service';
import { HeaderHandlerService } from './../services/headerHandler';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('accounts')
@ApiBearerAuth()
@ApiTags('authentication')
@UseGuards(AuthGuard)
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

}
