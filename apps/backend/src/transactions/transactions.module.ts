import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { GiftcardsModule } from '../giftcards/giftcards.module';

@Module({
  imports: [DrizzleModule, GiftcardsModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}