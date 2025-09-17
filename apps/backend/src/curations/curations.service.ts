import { Inject, Injectable } from '@nestjs/common';
import { CreateCuratedShowcaseDto } from './dto/create-curated-showcase.dto';
import { UpdateCuratedShowcaseDto } from './dto/update-curated-showcase.dto';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '@shared/drizzle';
import { schema } from '@shared/drizzle';
import { and, eq, exists } from '@shared/drizzle/operators';
import {
  IPaginatedResult,
  TCuratedCollection,
  TCuratedShowcase,
  TCuratedShowcaseFlattened,
} from '@shared/types';
import { CreateCuratedCollectionDto } from './dto/create-curated-collection.dto';
import { UpdateCuratedCollectionDto } from './dto/update-curated-collection.dto';

@Injectable()
export class CurationsService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async createCuratedShowcase(
    createCuratedShowcaseDto: CreateCuratedShowcaseDto,
    userId: string,
  ): Promise<TCuratedShowcase> {
    const createCuratedShowcase = {
      ...createCuratedShowcaseDto,
      userId,
      startDate: createCuratedShowcaseDto.startDate
        ? new Date(createCuratedShowcaseDto.startDate)
        : undefined,
      endDate: createCuratedShowcaseDto.endDate
        ? new Date(createCuratedShowcaseDto.endDate)
        : undefined,
    };
    return (
      await this.db
        .insert(schema.curatedShowcases)
        .values(createCuratedShowcase)
        .returning()
    )[0];
  }

  async findAllCuratedShowcases(
    limit = 12,
    offset = 0,
  ): Promise<IPaginatedResult<TCuratedShowcaseFlattened>> {
    const results = await this.db.query.curatedShowcases.findMany({
      where: eq(schema.curatedShowcases.isVisible, true),
      with: {
        showcase: {
          with: {
            user: {
              columns: {
                username: true,
                avatarUrl: true,
                isVerified: true,
                role: true,
              },
            },
            showcaseTags: {
              with: {
                tag: {
                  columns: {
                    id: true,
                    name: true,
                    slug: true,
                    color: true,
                    createdAt: true,
                    usageCount: true,
                  },
                },
              },
            },
            category: {
              columns: {
                name: true,
                slug: true,
                color: true,
              },
            },
          },
          columns: {
            id: true,
            userId: true,
            thumbnailUrl: true,
            title: true,
            slug: true,
            price: true,
            osCompatibility: true,
            shellCompatibility: true,
            isArchived: true,
            isPublished: true,
            isBanned: true,
          },
        },
      },
      columns: {
        id: true,
        thumbnailUrl: true,
        title: true,
        startDate: true,
        endDate: true,
      },
      limit,
      offset,
    });

    const items = results
      .filter(
        (result) =>
          result.showcase &&
          !result.showcase.isArchived &&
          result.showcase.isPublished &&
          !result.showcase.isBanned,
      )
      .map((result) => ({
        curatedShowcase: {
          id: result.id,
          thumbnailUrl: result.thumbnailUrl,
          title: result.title,
          startDate: result.startDate,
          endDate: result.endDate,
        },
        showcase: {
          id: result.showcase.id,
          userId: result.showcase.userId,
          thumbnailUrl: result.showcase.thumbnailUrl,
          title: result.showcase.title,
          slug: result.showcase.slug,
          price: result.showcase.price,
          osCompatibility: result.showcase.osCompatibility,
          shellCompatibility: result.showcase.shellCompatibility,
        },
        users: {
          username: result.showcase.user?.username,
          avatarUrl: result.showcase.user?.avatarUrl,
          isVerified: result.showcase.user?.isVerified,
          role: result.showcase.user?.role,
        },
        category: result.showcase.category,
        tags: result.showcase.showcaseTags.map((st) => st.tag).filter(Boolean),
      }));

    const total = await this.db.$count(
      schema.curatedShowcases,
      and(
        eq(schema.curatedShowcases.isVisible, true),
        exists(
          this.db
            .select()
            .from(schema.showcases)
            .where(
              and(
                eq(schema.showcases.id, schema.curatedShowcases.showcaseId),
                eq(schema.showcases.isArchived, false),
                eq(schema.showcases.isPublished, true),
                eq(schema.showcases.isBanned, false),
              ),
            ),
        ),
      ),
    );

    return {
      items,
      total,
      page: offset / limit + 1,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateCuratedShowcase(
    id: string,
    updateCuratedShowcaseDto: UpdateCuratedShowcaseDto,
  ) {
    const updateCuratedShowcase = {
      ...updateCuratedShowcaseDto,
      startDate: updateCuratedShowcaseDto.startDate
        ? new Date(updateCuratedShowcaseDto.startDate)
        : undefined,
      endDate: updateCuratedShowcaseDto.endDate
        ? new Date(updateCuratedShowcaseDto.endDate)
        : undefined,
    };
    return await this.db
      .update(schema.curatedShowcases)
      .set(updateCuratedShowcase)
      .where(eq(schema.curatedShowcases.id, id))
      .returning();
  }

  async removeCuratedShowcase(id: string): Promise<TCuratedShowcase> {
    return (
      await this.db
        .delete(schema.curatedShowcases)
        .where(eq(schema.curatedShowcases.id, id))
        .returning()
    )[0];
  }

  // Curated Collections

  async createCuratedCollection(
    createCuratedCollectionDto: CreateCuratedCollectionDto,
    userId: string,
  ): Promise<TCuratedCollection> {
    const createCuratedCollection = {
      ...createCuratedCollectionDto,
      userId,
      startDate: createCuratedCollectionDto.startDate
        ? new Date(createCuratedCollectionDto.startDate)
        : undefined,
      endDate: createCuratedCollectionDto.endDate
        ? new Date(createCuratedCollectionDto.endDate)
        : undefined,
    };
    return (
      await this.db
        .insert(schema.curatedCollections)
        .values(createCuratedCollection)
        .returning()
    )[0];
  }

  async findAllCuratedCollections() {
    return await this.db.select().from(schema.curatedCollections);
  }

  async updateCuratedCollection(
    id: string,
    updateCuratedCollectionDto: UpdateCuratedCollectionDto,
  ) {
    const updateCuratedCollection = {
      ...updateCuratedCollectionDto,
      startDate: updateCuratedCollectionDto.startDate
        ? new Date(updateCuratedCollectionDto.startDate)
        : undefined,
      endDate: updateCuratedCollectionDto.endDate
        ? new Date(updateCuratedCollectionDto.endDate)
        : undefined,
    };
    return await this.db
      .update(schema.curatedCollections)
      .set(updateCuratedCollection)
      .where(eq(schema.curatedCollections.id, id))
      .returning();
  }

  async removeCuratedCollection(id: string): Promise<TCuratedCollection> {
    return (
      await this.db
        .delete(schema.curatedCollections)
        .where(eq(schema.curatedCollections.id, id))
        .returning()
    )[0];
  }
}
