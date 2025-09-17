import { sql } from "drizzle-orm";
import {
  boolean,
  decimal,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { categories, tags } from "./content";

export const showcases = pgTable("showcases", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  description: text("description").notNull(),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }).notNull(),
  zipFileUrl: varchar("zip_file_url", { length: 500 }).notNull(),
  price: decimal("price", { precision: 8, scale: 2 }).default("0.00").notNull(),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id),
  osCompatibility: varchar("os_compatibility", { length: 50 }),
  shellCompatibility: varchar("shell_compatibility", { length: 100 }),
  difficultyLevel: varchar("difficulty_level", { length: 20 }),
  installationInstructions: text("installation_instructions"),
  requirements: text("requirements"),
  version: varchar("version", { length: 20 }).default("1.0.0").notNull(),
  fileSizeMb: decimal("file_size_mb", { precision: 8, scale: 2 }),
  isFeatured: boolean("is_featured").default(false).notNull(),
  isPublished: boolean("is_published").default(false).notNull(),
  isArchived: boolean("is_archived").default(false).notNull(),
  isBanned: boolean("is_banned").default(false).notNull(),
  likesCount: integer("likes_count").default(0).notNull(),
  dislikesCount: integer("dislikes_count").default(0).notNull(),
  downloadsCount: integer("downloads_count").default(0).notNull(),
  commentsCount: integer("comments_count").default(0).notNull(),
  viewsCount: integer("views_count").default(0).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`now()`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`now()`)
    .notNull(),
  publishedAt: timestamp("published_at"),
});

export const showcaseImages = pgTable("showcase_images", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  showcaseId: uuid("showcase_id")
    .notNull()
    .references(() => showcases.id),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  altText: varchar("alt_text", { length: 200 }),
  displayOrder: integer("display_order").default(0).notNull(),
  isPrimary: boolean("is_primary").default(false).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`now()`)
    .notNull(),
});

export const showcaseTags = pgTable("showcase_tags", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  showcaseId: uuid("showcase_id")
    .notNull()
    .references(() => showcases.id),
  tagId: uuid("tag_id")
    .notNull()
    .references(() => tags.id),
  createdAt: timestamp("created_at")
    .default(sql`now()`)
    .notNull(),
});

export const showcaseLikes = pgTable("showcase_likes", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  showcaseId: uuid("showcase_id")
    .notNull()
    .references(() => showcases.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  isLike: boolean("is_like").notNull(), // true = like, false = dislike
  createdAt: timestamp("created_at")
    .default(sql`now()`)
    .notNull(),
});
