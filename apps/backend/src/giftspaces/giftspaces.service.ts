import { Inject, Injectable } from '@nestjs/common';
import { CreateGiftspaceDto } from './dto/create-giftspace.dto';
import { UpdateGiftspaceDto } from './dto/update-giftspace.dto';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '@shared/drizzle';
import { schema } from '@shared/drizzle';
import { eq, and, ne } from '@shared/drizzle/operators';
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
    // 1. Get IDs of giftspaces that have at least one other person besides the owner
    // We do this by finding giftspaces where there's a user record that isn't the owner
    const trulySharedIds = this.db
      .select({
        id: schema.giftspacesUsers.giftspaceId,
      })
      .from(schema.giftspacesUsers)
      .innerJoin(
        schema.giftspaces,
        eq(schema.giftspacesUsers.giftspaceId, schema.giftspaces.id),
      )
      .where(ne(schema.giftspacesUsers.userId, schema.giftspaces.owner))
      .as('truly_shared_ids');

    // 2. Return the giftspaces for this user that are in that list
    return await this.db
      .select({
        id: schema.giftspaces.id,
        name: schema.giftspaces.name,
        owner: schema.giftspaces.owner,
        createdAt: schema.giftspaces.createdAt,
      })
      .from(schema.giftspaces)
      .innerJoin(trulySharedIds, eq(schema.giftspaces.id, trulySharedIds.id))
      .innerJoin(
        schema.giftspacesUsers,
        and(
          eq(schema.giftspacesUsers.giftspaceId, schema.giftspaces.id),
          eq(schema.giftspacesUsers.userId, userId),
        ),
      )
      .groupBy(schema.giftspaces.id);
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

  async getGiftspaceUsers(giftspaceId: string) {
    return await this.db
      .select({
        id: schema.users.id,
        username: schema.users.username,
        email: schema.users.email,
      })
      .from(schema.giftspacesUsers)
      .innerJoin(
        schema.users,
        eq(schema.giftspacesUsers.userId, schema.users.id),
      )
      .where(eq(schema.giftspacesUsers.giftspaceId, giftspaceId));
  }

  async addUserToGiftspace(giftspaceId: string, userId: string) {
    // Check if user is already in the giftspace
    const existing = await this.db
      .select()
      .from(schema.giftspacesUsers)
      .where(
        and(
          eq(schema.giftspacesUsers.giftspaceId, giftspaceId),
          eq(schema.giftspacesUsers.userId, userId),
        ),
      );

    if (existing.length > 0) {
      return existing[0];
    }

    return (
      await this.db
        .insert(schema.giftspacesUsers)
        .values({ giftspaceId, userId })
        .returning()
    )[0];
  }

  async removeUserFromGiftspace(giftspaceId: string, userId: string) {
    return (
      await this.db
        .delete(schema.giftspacesUsers)
        .where(
          and(
            eq(schema.giftspacesUsers.giftspaceId, giftspaceId),
            eq(schema.giftspacesUsers.userId, userId),
          ),
        )
        .returning()
    )[0];
  }
}
