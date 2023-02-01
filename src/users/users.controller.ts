import { Body, Controller, Headers, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import LoginDto from './dto/login.dto';
import SignUpDto from './dto/sign-up.dto';
import { UsersService } from './users.service';
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.usersService.signUp(signUpDto);
  }

  @Post('login')
  async login(
    @Req() req,
    @Body() loginDto: LoginDto,
    @Headers() headers: Headers,
  ) {
    const ipAddress = req.connection.remoteAddress;
    const ua = headers['user-agent'];
    const metaData: LoginMetadata = { ipAddress, ua };
    return this.usersService.login(loginDto, metaData, req);
  }
}

export interface LoginMetadata {
  ipAddress: string;
  ua: string;
}
