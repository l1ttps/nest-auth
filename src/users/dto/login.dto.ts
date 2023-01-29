import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export default class LoginDto {
  @IsEmail()
  @ApiProperty({ required: true, example: 'mail@example.com' })
  readonly email: string;

  @ApiProperty({ required: true })
  readonly password: string;
}
