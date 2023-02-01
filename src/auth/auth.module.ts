import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { HeaderHandlerService } from './guard/headerHandler';

@Module({
  imports: [UsersModule],
  providers: [HeaderHandlerService],
})
export class AuthModule {}
