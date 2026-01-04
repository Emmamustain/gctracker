import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '@shared/drizzle';
import { schema } from '@shared/drizzle';
import { eq } from '@shared/drizzle/operators';
import * as bcrypt from 'bcrypt';
import { TUser } from '@shared/types';

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async create(createUserDto: CreateUserDto): Promise<TUser> {
    // Hash the password before storing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );

    const userToCreate = {
      ...createUserDto,
      password: hashedPassword,
    };

    return await this.db.transaction(async (tx) => {
      const [newUser] = await tx
        .insert(schema.users)
        .values(userToCreate)
        .returning();

      const [personalGiftspace] = await tx
        .insert(schema.giftspaces)
        .values({
          name: 'personal',
          owner: newUser.id,
          password: null, // No password for personal giftspace
        })
        .returning();

      await tx.insert(schema.giftspacesUsers).values({
        giftspaceId: personalGiftspace.id,
        userId: newUser.id,
      });

      return newUser;
    });
  }

  async findAll() {
    return await this.db.select().from(schema.users);
  }

  async findOne(id: string) {
    return await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id));
  }

  async findOneByEmail(email: string) {
    return await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email));
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // Hash password if it's being updated
    const dataToUpdate = { ...updateUserDto };
    if (updateUserDto.password) {
      const saltRounds = 10;
      dataToUpdate.password = await bcrypt.hash(
        updateUserDto.password,
        saltRounds,
      );
    }

    return await this.db
      .update(schema.users)
      .set(dataToUpdate)
      .where(eq(schema.users.id, id))
      .returning();
  }

  async remove(id: string): Promise<TUser> {
    return (
      await this.db
        .delete(schema.users)
        .where(eq(schema.users.id, id))
        .returning()
    )[0];
  }
}
