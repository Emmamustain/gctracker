import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  iconUrl: varchar("icon_url", { length: 500 }),
  color: varchar("color", { length: 7 }), // hex color
  isActive: boolean("is_active").default(true).notNull(),
  showcaseCount: integer("showcase_count").default(0).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`now()`)
    .notNull(),
});

export const tags = pgTable("tags", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 50 }).notNull().unique(),
  slug: varchar("slug", { length: 50 }).notNull().unique(),
  color: varchar("color", { length: 7 }), // hex color
  usageCount: integer("usage_count").default(0).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`now()`)
    .notNull(),
});
