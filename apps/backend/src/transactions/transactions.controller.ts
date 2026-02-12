import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TCreateTransaction, TUpdateTransaction } from '@shared/types';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Body() createTransactionDto: TCreateTransaction) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get()
  findAll() {
    return this.transactionsService.findAll();
  }

  @Get('giftcard/:giftcardId')
  findByGiftcard(@Param('giftcardId') giftcardId: string) {
    return this.transactionsService.findByGiftcard(giftcardId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransactionDto: TUpdateTransaction) {
    return this.transactionsService.update(id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(id);
  }

  @Post('giftcard/:giftcardId/add')
  async addTransaction(
    @Param('giftcardId') giftcardId: string,
    @Body() body: { amount: number; description?: string }
  ) {
    return this.transactionsService.createAndUpdateBalance(
      giftcardId,
      body.amount,
      body.description
    );
  }

  @Post('discard/:giftcardId')
  async discardGiftcard(@Param('giftcardId') giftcardId: string) {
    return this.transactionsService.discardGiftcard(giftcardId);
  }
}