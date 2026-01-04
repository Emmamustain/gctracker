import { Module } from '@nestjs/common';
import { GiftcardsService } from './giftcards.service';
import { GiftcardsController } from './giftcards.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [GiftcardsController],
  providers: [GiftcardsService],
  imports: [DrizzleModule, ConfigModule],
  exports: [GiftcardsService],
})
export class GiftcardsModule {}
