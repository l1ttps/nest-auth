import { LoginDto } from './../account/dto/accounts.dto';
import { AccountService } from './../account/accounts.service';
import { HeaderHandlerService } from './../services/headerHandler';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('accounts')
export class AccountsController {
    constructor(
        private accountService: AccountService,
        private headerHandlerService: HeaderHandlerService,
    ) { }

    @Post("login")
    async login(@Body() loginDto: LoginDto): Promise<{}> {
        return this.accountService.login(loginDto)
    }

}
