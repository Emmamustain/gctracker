import { Inject, Injectable } from '@nestjs/common';
import { CreateGiftcardDto } from './dto/create-giftcard.dto';
import { UpdateGiftcardDto } from './dto/update-giftcard.dto';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '@shared/drizzle';
import { schema } from '@shared/drizzle';
import { eq } from '@shared/drizzle/operators';
import { TGiftcard } from '@shared/types';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GiftcardsService {
  private readonly algorithm = 'aes-256-cbc';
  private readonly key: Buffer;

  constructor(
    @Inject(DRIZZLE) private db: DrizzleDB,
    private configService: ConfigService,
  ) {
    const encryptionKey = this.configService.get<string>('ENCRYPTION_KEY');
    if (!encryptionKey) {
      throw new Error('ENCRYPTION_KEY is missing in the environment variables');
    }

    // Use scrypt to derive a 32-byte key from whatever string is provided.
    // This handles keys of any length and special characters safely.
    this.key = crypto.scryptSync(encryptionKey, 'master-salt', 32) as Buffer;
  }

  private encrypt(text: string, password?: string): string {
    const iv = crypto.randomBytes(16);
    let encryptionKey = this.key;

    if (password) {
      // Derive a 32-byte key from the user's plain-text password
      // This is never stored; it's re-derived on every request
      encryptionKey = crypto.scryptSync(
        password,
        'salt-for-codes',
        32,
      ) as Buffer;
    }

    const cipher = crypto.createCipheriv(this.algorithm, encryptionKey, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Prefix tells us if we need a password (:p) or master key (:m) to decrypt later
    return `v1:${iv.toString('hex')}:${encrypted}${password ? ':p' : ':m'}`;
  }

  private decrypt(encryptedText: string, password?: string): string {
    const parts = encryptedText.split(':');
    if (parts[0] !== 'v1') return 'ENCRYPTED_FORMAT_ERROR';

    const iv = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    const isPasswordProtected = parts[3] === 'p';

    let decryptionKey = this.key;
    if (isPasswordProtected) {
      if (!password) {
        return 'PASSWORD_REQUIRED'; // We return a hint instead of crashing
      }
      decryptionKey = crypto.scryptSync(
        password,
        'salt-for-codes',
        32,
      ) as Buffer;
    }

    try {
      const decipher = crypto.createDecipheriv(
        this.algorithm,
        decryptionKey,
        iv,
      );
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (e) {
      console.error(e);
      return 'DECRYPTION_FAILED'; // Likely wrong password
    }
  }

  async create(
    createGiftcardDto: CreateGiftcardDto,
    giftspacePassword?: string,
  ): Promise<TGiftcard> {
    const encryptedCode = this.encrypt(
      createGiftcardDto.code,
      giftspacePassword,
    );

    const giftcardToCreate = {
      ...createGiftcardDto,
      code: encryptedCode,
    };

    const [giftcard] = await this.db
      .insert(schema.giftcards)
      .values(giftcardToCreate)
      .returning();

    return {
      ...giftcard,
      code: this.decrypt(giftcard.code, giftspacePassword),
    };
  }

  async findAll(giftspacePassword?: string) {
    const cards = await this.db.select().from(schema.giftcards);
    return cards.map((card) => ({
      ...card,
      code: this.decrypt(card.code, giftspacePassword),
    }));
  }

  async findOne(id: string, giftspacePassword?: string) {
    const giftcard = await this.db.query.giftcards.findFirst({
      where: eq(schema.giftcards.id, id),
    });

    if (giftcard) {
      return {
        ...giftcard,
        code: this.decrypt(giftcard.code, giftspacePassword),
      };
    }
    return null;
  }

  async findAllByGiftspace(giftspaceId: string, giftspacePassword?: string) {
    const cards = await this.db
      .select()
      .from(schema.giftcards)
      .where(eq(schema.giftcards.giftspace, giftspaceId));

    return cards.map((card) => ({
      ...card,
      code: this.decrypt(card.code, giftspacePassword),
    }));
  }

  async update(
    id: string,
    updateGiftcardDto: UpdateGiftcardDto,
    giftspacePassword?: string,
  ) {
    const dataToUpdate = { ...updateGiftcardDto };
    if (updateGiftcardDto.code) {
      dataToUpdate.code = this.encrypt(
        updateGiftcardDto.code,
        giftspacePassword,
      );
    }

    const [updatedCard] = await this.db
      .update(schema.giftcards)
      .set(dataToUpdate)
      .where(eq(schema.giftcards.id, id))
      .returning();

    if (updatedCard) {
      return {
        ...updatedCard,
        code: this.decrypt(updatedCard.code, giftspacePassword),
      };
    }
    return null;
  }

  async remove(id: string, giftspacePassword?: string): Promise<TGiftcard> {
    const [deletedCard] = await this.db
      .delete(schema.giftcards)
      .where(eq(schema.giftcards.id, id))
      .returning();

    if (deletedCard) {
      return {
        ...deletedCard,
        code: this.decrypt(deletedCard.code, giftspacePassword),
      };
    }
    return null;
  }
}
