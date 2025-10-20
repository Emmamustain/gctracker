import { Module } from '@nestjs/common';
import { GiftcardsService } from './giftcards.service';
import { GiftcardsController } from './giftcards.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  controllers: [GiftcardsController],
  providers: [GiftcardsService],
  imports: [DrizzleModule],
  exports: [GiftcardsService],
})
export class GiftcardsModule {}
