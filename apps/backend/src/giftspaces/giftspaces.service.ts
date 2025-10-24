import { Inject, Injectable } from '@nestjs/common';
import { CreateGiftspaceDto } from './dto/create-giftspace.dto';
import { UpdateGiftspaceDto } from './dto/update-giftspace.dto';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '@shared/drizzle';
import { schema } from '@shared/drizzle';
import { eq } from '@shared/drizzle/operators';
import * as bcrypt from 'bcrypt';
import { TGiftspace } from '@shared/types';

@Injectable()
export class GiftspacesService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async create(createGiftspaceDto: CreateGiftspaceDto): Promise<TGiftspace> {
    // Hash the password before storing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createGiftspaceDto.password,
      saltRounds,
    );

    const giftspaceToCreate = {
      ...createGiftspaceDto,
      password: hashedPassword,
    };

    return (
      await this.db
        .insert(schema.giftspaces)
        .values(giftspaceToCreate)
        .returning()
    )[0];
  }

  async findAll() {
    return await this.db.select().from(schema.giftspaces);
  }

  async findOne(id: string) {
    return await this.db
      .select()
      .from(schema.giftspaces)
      .where(eq(schema.giftspaces.id, id));
  }

  async findAllByOwner(owner: string) {
    return await this.db
      .select()
      .from(schema.giftspaces)
      .where(eq(schema.giftspaces.owner, owner));
  }

  async findAllShared(userId: string) {
    return await this.db
      .select({
        id: schema.giftspaces.id,
        name: schema.giftspaces.name,
        owner: schema.giftspaces.owner,
        createdAt: schema.giftspaces.createdAt,
      })
      .from(schema.giftspacesUsers)
      .where(eq(schema.giftspacesUsers.userId, userId))
      .fullJoin(
        schema.giftspaces,
        eq(schema.giftspacesUsers.giftspaceId, schema.giftspaces.id),
      );
  }

  async update(id: string, updateGiftspaceDto: UpdateGiftspaceDto) {
    // Hash password if it's being updated
    const dataToUpdate = { ...updateGiftspaceDto };
    if (updateGiftspaceDto.password) {
      const saltRounds = 10;
      dataToUpdate.password = await bcrypt.hash(
        updateGiftspaceDto.password,
        saltRounds,
      );
    }

    return await this.db
      .update(schema.giftspaces)
      .set(dataToUpdate)
      .where(eq(schema.giftspaces.id, id))
      .returning();
  }

  async remove(id: string): Promise<TGiftspace> {
    return (
      await this.db
        .delete(schema.giftspaces)
        .where(eq(schema.giftspaces.id, id))
        .returning()
    )[0];
  }
}
