import { Body, Controller, Headers, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeviceSessionsService } from 'src/device-sessions/device-sessions.service';
import LoginDto from './dto/login.dto';
import ReAuthDto from './dto/reauth.dto';
import SignUpDto from './dto/sign-up.dto';
import { UsersService } from './users.service';
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private deviceSessionsService: DeviceSessionsService,
  ) {}

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
    const fingerprint = req.fingerprint;
    const ipAddress = req.connection.remoteAddress;
    const ua = headers['user-agent'];
    const deviceId = fingerprint.hash;
    const metaData: LoginMetadata = { ipAddress, ua, deviceId };
    return this.usersService.login(loginDto, metaData);
  }

  @Post('refresh-token')
  async reAuth(@Body() body: ReAuthDto, @Req() req) {
    const deviceId = req.fingerprint.hash;
    const { refreshToken } = body;
    return this.deviceSessionsService.reAuth(deviceId, refreshToken);
  }
}

export interface LoginMetadata {
  ipAddress: string;
  ua: string;
  deviceId: string;
}
