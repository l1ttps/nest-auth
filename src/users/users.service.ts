import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DeviceSessionsService } from 'src/device-sessions/device-sessions.service';
import { Repository } from 'typeorm';
import LoginDto from './dto/login.dto';
import SignUpDto from './dto/sign-up.dto';
import { UserEntity } from './user.entity';
import { LoginMetadata } from './users.controller';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private repository: Repository<UserEntity>,
    private deviceSessionsService: DeviceSessionsService,
  ) {}
  async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async login(loginDto: LoginDto, metaData: LoginMetadata, req) {
    const { email, password } = loginDto;
    const user = await this.repository.findOne({
      where: { email },
    });
    if (
      !user ||
      user.password !== (await this.hashPassword(password, user.salt))
    ) {
      throw new UnauthorizedException('Email or password incorect');
    } else {
      return await this.deviceSessionsService.handleDeviceSession(
        user.id,
        metaData,
        req,
      );
    }
  }

  async signUp(signUpDto: SignUpDto) {
    const { email, password } = signUpDto;

    if (!!(await this.repository.count({ where: { email: email } })))
      throw new ConflictException(
        'This email address is already used. Try a different email address.',
      );

    const salt = await bcrypt.genSalt();
    const newUser = new UserEntity();
    newUser.email = email;
    newUser.salt = salt;
    newUser.password = await this.hashPassword(password, salt);
    try {
      await this.repository.save(newUser);
      return {
        message: 'Success',
      };
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
