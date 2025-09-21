import { Module } from '@nestjs/common';
import { GiftspacesService } from './giftspaces.service';
import { GiftspacesController } from './giftspaces.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  controllers: [GiftspacesController],
  providers: [GiftspacesService],
  imports: [DrizzleModule],
  exports: [GiftspacesService],
})
export class GiftspacesModule {}
