import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '@shared/drizzle';
import { schema } from '@shared/drizzle';
import { eq } from '@shared/drizzle/operators';
import { TCategory } from '@shared/types';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<TCategory> {
    return (
      await this.db
        .insert(schema.categories)
        .values(createCategoryDto)
        .returning()
    )[0];
  }

  async findAll() {
    return await this.db.select().from(schema.categories);
  }

  async findOne(id: string) {
    return await this.db
      .select()
      .from(schema.categories)
      .where(eq(schema.categories.id, id));
  }

  async findOneBySlug(slug: string) {
    return await this.db
      .select()
      .from(schema.categories)
      .where(eq(schema.categories.slug, slug));
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return await this.db
      .update(schema.categories)
      .set(updateCategoryDto)
      .where(eq(schema.categories.id, id))
      .returning();
  }

  async remove(id: string): Promise<TCategory> {
    return (
      await this.db
        .delete(schema.categories)
        .where(eq(schema.categories.id, id))
        .returning()
    )[0];
  }
}
