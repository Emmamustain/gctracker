import { Inject, Injectable } from '@nestjs/common';
import { CreateGiftcardDto } from './dto/create-giftcard.dto';
import { UpdateGiftcardDto } from './dto/update-giftcard.dto';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '@shared/drizzle';
import { schema } from '@shared/drizzle';
import { eq } from '@shared/drizzle/operators';
import * as bcrypt from 'bcrypt';
import { TGiftcard } from '@shared/types';

@Injectable()
export class GiftcardsService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async create(createGiftcardDto: CreateGiftcardDto): Promise<TGiftcard> {
    // Hash the code before storing
    const saltRounds = 10;
    const hashedCode = await bcrypt.hash(createGiftcardDto.code, saltRounds);

    const giftcardToCreate = {
      ...createGiftcardDto,
      code: hashedCode,
    };

    return (
      await this.db
        .insert(schema.giftcards)
        .values(giftcardToCreate)
        .returning()
    )[0];
  }

  async findAll() {
    return await this.db.select().from(schema.giftcards);
  }

  async findOne(id: string) {
    return await this.db
      .select()
      .from(schema.giftcards)
      .where(eq(schema.giftcards.id, id));
  }

  async findAllByGiftspace(giftspaceId: string) {
    return await this.db
      .select()
      .from(schema.giftcards)
      .where(eq(schema.giftcards.giftspace, giftspaceId));
  }

  async update(id: string, updateGiftcardDto: UpdateGiftcardDto) {
    // Hash code if it's being updated
    const dataToUpdate = { ...updateGiftcardDto };
    if (updateGiftcardDto.code) {
      const saltRounds = 10;
      dataToUpdate.code = await bcrypt.hash(updateGiftcardDto.code, saltRounds);
    }

    return await this.db
      .update(schema.giftcards)
      .set(dataToUpdate)
      .where(eq(schema.giftcards.id, id))
      .returning();
  }

  async remove(id: string): Promise<TGiftcard> {
    return (
      await this.db
        .delete(schema.giftcards)
        .where(eq(schema.giftcards.id, id))
        .returning()
    )[0];
  }
}
