import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '@shared/drizzle';
import { schema } from '@shared/drizzle';
import { eq, desc } from '@shared/drizzle/operators';
import { TCreateTransaction, TUpdateTransaction } from '@shared/types';
import { GiftcardsService } from '../giftcards/giftcards.service';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject(DRIZZLE) private db: DrizzleDB,
    private giftcardsService: GiftcardsService,
  ) {}

  async create(createTransactionDto: TCreateTransaction) {
    const [transaction] = await this.db
      .insert(schema.transactions)
      .values(createTransactionDto)
      .returning();
    return transaction;
  }

  async findAll() {
    return this.db
      .select()
      .from(schema.transactions)
      .orderBy(desc(schema.transactions.createdAt));
  }

  async findOne(id: string) {
    return this.db.query.transactions.findFirst({
      where: eq(schema.transactions.id, id),
    });
  }

  async findByGiftcard(giftcardId: string) {
    return this.db
      .select()
      .from(schema.transactions)
      .where(eq(schema.transactions.giftcardId, giftcardId))
      .orderBy(desc(schema.transactions.createdAt));
  }

  async update(id: string, updateTransactionDto: TUpdateTransaction) {
    const [updatedTransaction] = await this.db
      .update(schema.transactions)
      .set(updateTransactionDto)
      .where(eq(schema.transactions.id, id))
      .returning();
    return updatedTransaction;
  }

  async remove(id: string) {
    // Start a transaction to ensure atomicity
    return await this.db.transaction(async (tx) => {
      // Get the transaction before deleting it
      const transaction = await tx.query.transactions.findFirst({
        where: eq(schema.transactions.id, id),
      });

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      // Get the current giftcard balance
      const giftcard = await tx.query.giftcards.findFirst({
        where: eq(schema.giftcards.id, transaction.giftcardId),
      });

      if (!giftcard) {
        throw new Error('Gift card not found');
      }

      // Calculate new balance (add back the transaction amount)
      const currentBalance = parseFloat(giftcard.balance || '0');
      const transactionAmount = parseFloat(transaction.amount);
      const newBalance = currentBalance + transactionAmount;

      // Update giftcard balance
      await tx
        .update(schema.giftcards)
        .set({ balance: newBalance.toString() })
        .where(eq(schema.giftcards.id, transaction.giftcardId));

      // Delete the transaction
      const [deletedTransaction] = await tx
        .delete(schema.transactions)
        .where(eq(schema.transactions.id, id))
        .returning();

      return deletedTransaction;
    });
  }

  async createAndUpdateBalance(
    giftcardId: string,
    amount: number,
    description?: string,
  ) {
    // Start a transaction to ensure atomicity
    return await this.db.transaction(async (tx) => {
      // Get current giftcard
      const giftcard = await tx.query.giftcards.findFirst({
        where: eq(schema.giftcards.id, giftcardId),
      });

      if (!giftcard) {
        throw new Error('Gift card not found');
      }

      const currentBalance = parseFloat(giftcard.balance || '0');
      const transactionAmount = parseFloat(amount.toString());
      const newBalance = currentBalance - transactionAmount;

      // Check if balance would go negative
      if (newBalance < 0) {
        return {
          requiresDiscard: true,
          currentBalance: currentBalance,
          transactionAmount: transactionAmount,
          newBalance: newBalance,
          giftcard: giftcard,
        };
      }

      // Create transaction
      const [transaction] = await tx
        .insert(schema.transactions)
        .values({
          giftcardId,
          amount: transactionAmount.toString(),
          description,
        })
        .returning();

      // Update giftcard balance
      const [updatedGiftcard] = await tx
        .update(schema.giftcards)
        .set({ balance: newBalance.toString() })
        .where(eq(schema.giftcards.id, giftcardId))
        .returning();

      return {
        transaction,
        giftcard: updatedGiftcard,
        newBalance,
        requiresDiscard: false,
      };
    });
  }

  async discardGiftcard(giftcardId: string) {
    const [giftcard] = await this.db
      .update(schema.giftcards)
      .set({
        balance: '0', // Set balance to 0 to indicate discarded
        discarded: true,
      })
      .where(eq(schema.giftcards.id, giftcardId))
      .returning();

    return giftcard;
  }
}
