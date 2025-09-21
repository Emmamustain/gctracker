import { Test, TestingModule } from '@nestjs/testing';
import { GiftspacesService } from './giftspaces.service';

describe('GiftspacesService', () => {
  let service: GiftspacesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GiftspacesService],
    }).compile();

    service = module.get<GiftspacesService>(GiftspacesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
