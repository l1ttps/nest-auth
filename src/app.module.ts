import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HeaderHandlerService } from './auth/guard/headerHandler';
import { DeviceSessionsModule } from './device-sessions/device-sessions.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      port: 5432,
      host: process.env.DB_HOST,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity.{js,ts}'],
      keepConnectionAlive: true,
      synchronize: true,
      ssl: true,
    }),
    UsersModule,
    DeviceSessionsModule,
  ],
  controllers: [AppController],
  providers: [AppService, HeaderHandlerService],
})
export class AppModule {}
