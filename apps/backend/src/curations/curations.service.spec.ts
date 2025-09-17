import { Test, TestingModule } from '@nestjs/testing';
import { CurationsService } from './curations.service';

describe('CurationsService', () => {
  let service: CurationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CurationsService],
    }).compile();

    service = module.get<CurationsService>(CurationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
