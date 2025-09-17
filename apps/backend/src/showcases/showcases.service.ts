import { Inject, Injectable } from '@nestjs/common';
import { CreateShowcaseDto } from './dto/create-showcase.dto';
import { UpdateShowcaseDto } from './dto/update-showcase.dto';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '@shared/drizzle';
import { schema } from '@shared/drizzle';
import { eq } from '@shared/drizzle/operators';
import { TShowcase } from '@shared/types';

@Injectable()
export class ShowcasesService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async create(
    createShowcaseDto: CreateShowcaseDto,
    userId: string,
  ): Promise<TShowcase> {
    const createShowcase = {
      ...createShowcaseDto,
      slug: createShowcaseDto.title.toLowerCase().replace(/\s+/g, '-'),
      userId,
    };
    return (
      await this.db.insert(schema.showcases).values(createShowcase).returning()
    )[0];
  }

  async findAll() {
    return await this.db.select().from(schema.showcases);
  }

  async findOne(id: string) {
    return await this.db
      .select()
      .from(schema.showcases)
      .where(eq(schema.showcases.id, id));
  }

  async findOneBySlug(slug: string) {
    return await this.db
      .select()
      .from(schema.showcases)
      .where(eq(schema.showcases.slug, slug));
  }

  async update(id: string, updateShowcaseDto: UpdateShowcaseDto) {
    return await this.db
      .update(schema.showcases)
      .set(updateShowcaseDto)
      .where(eq(schema.showcases.id, id))
      .returning();
  }

  async remove(id: string): Promise<TShowcase> {
    return (
      await this.db
        .delete(schema.showcases)
        .where(eq(schema.showcases.id, id))
        .returning()
    )[0];
  }
}
