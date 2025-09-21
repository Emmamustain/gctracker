import { Test, TestingModule } from '@nestjs/testing';
import { GiftspacesController } from './giftspaces.controller';
import { GiftspacesService } from './giftspaces.service';

describe('UsersController', () => {
  let controller: GiftspacesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GiftspacesController],
      providers: [GiftspacesService],
    }).compile();

    controller = module.get<GiftspacesController>(GiftspacesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
