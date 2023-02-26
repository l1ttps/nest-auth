import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class ReAuthDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  readonly refreshToken: string;
}
