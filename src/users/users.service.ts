import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import SignUpDto from './dto/sign-up.dto';
import { UserEntity } from './user.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private repository: Repository<UserEntity>,
  ) {}
  async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
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
