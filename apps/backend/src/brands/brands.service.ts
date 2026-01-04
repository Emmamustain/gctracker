import { Inject, Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '@shared/drizzle';
import { schema } from '@shared/drizzle';
import { eq } from '@shared/drizzle/operators';
import { TBrand } from '@shared/types';

@Injectable()
export class BrandsService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async create(createBrandDto: CreateBrandDto): Promise<TBrand> {
    const { categories, ...brandData } = createBrandDto;
    const brandToCreate = {
      ...brandData,
    };

    const brand = (
      await this.db.insert(schema.brands).values(brandToCreate).returning()
    )[0];

    if (categories && categories.length > 0) {
      await this.db.insert(schema.categoriesBrands).values(
        categories.map((categoryId) => ({
          brandId: brand.id,
          categoryId: categoryId,
        })),
      );
    }
    return brand;
  }

  async findAll() {
    return await this.db.select().from(schema.brands);
  }

  async findOne(id: string) {
    return await this.db
      .select()
      .from(schema.brands)
      .where(eq(schema.brands.id, id));
  }

  async findAllByCategory(category: string) {
    return await this.db
      .select()
      .from(schema.brands)
      .leftJoin(
        schema.categoriesBrands,
        eq(schema.brands.id, schema.categoriesBrands.brandId),
      )
      .where(eq(schema.categoriesBrands.categoryId, category));
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    // Hash password if it's being updated
    const dataToUpdate = { ...updateBrandDto };

    return await this.db
      .update(schema.brands)
      .set(dataToUpdate)
      .where(eq(schema.brands.id, id))
      .returning();
  }

  async remove(id: string): Promise<TBrand> {
    return (
      await this.db
        .delete(schema.brands)
        .where(eq(schema.brands.id, id))
        .returning()
    )[0];
  }
}
