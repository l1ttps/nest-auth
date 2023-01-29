import { Test, TestingModule } from '@nestjs/testing';
import { DeviceSessionsService } from './device-sessions.service';

describe('DeviceSessionsService', () => {
  let service: DeviceSessionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeviceSessionsService],
    }).compile();

    service = module.get<DeviceSessionsService>(DeviceSessionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
