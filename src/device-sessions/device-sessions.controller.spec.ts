import { Test, TestingModule } from '@nestjs/testing';
import { DeviceSessionsController } from './device-sessions.controller';
import { DeviceSessionsService } from './device-sessions.service';

describe('DeviceSessionsController', () => {
  let controller: DeviceSessionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeviceSessionsController],
      providers: [DeviceSessionsService],
    }).compile();

    controller = module.get<DeviceSessionsController>(DeviceSessionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
