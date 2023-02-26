import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class LogoutDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  readonly sessionId: string;
}
