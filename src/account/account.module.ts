import { AccountsController } from './../account/account.controller';
import { Account } from './../account/account.entity';
import { HeaderHandlerService } from './../services/headerHandler';
import { CacheService } from './../services/caching';
import { SendMailService } from './../services/mail';
import { AccountService } from './../account/accounts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Global, Module } from '@nestjs/common';

@Module({})
@Global()
@Module({
    imports: [TypeOrmModule.forFeature([Account])],
    controllers: [AccountsController],
    providers: [AccountService, SendMailService, CacheService, HeaderHandlerService],
})
export class AccountsModule { }
