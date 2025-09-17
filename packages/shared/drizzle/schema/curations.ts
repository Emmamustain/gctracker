import { sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { showcases } from "./showcases";
import { users } from "./users";
import { collections } from "./community";

export const curatedShowcases = pgTable("curated_showcases", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id), // Admin User ID
  showcaseId: uuid("showcase_id")
    .notNull()
    .references(() => showcases.id),
  title: varchar("title", { length: 200 }).notNull(),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }), // Optional override image
  linkUrl: varchar("link_url", { length: 500 }), // Optional override link
  position: integer("position").default(0).notNull(), // Display order
  isVisible: boolean("is_visible").default(true).notNull(), // Is it visible?
  startDate: timestamp("start_date"), // Optional start date
  endDate: timestamp("end_date"), // Optional end date
  viewsCount: integer("views_count").default(0).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`now()`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`now()`)
    .notNull(),
});

export const curatedCollections = pgTable("curated_collections", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id), // Admin User ID
  collectionId: uuid("collection_id")
    .notNull()
    .references(() => collections.id),
  title: varchar("title", { length: 200 }).notNull(),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }), // Optional override image
  linkUrl: varchar("link_url", { length: 500 }), // Optional override link
  position: integer("position").default(0).notNull(), // Display order
  isVisible: boolean("is_visible").default(true).notNull(), // Is it visible?
  startDate: timestamp("start_date"), // Optional start date
  endDate: timestamp("end_date"), // Optional end date
  viewsCount: integer("views_count").default(0).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`now()`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`now()`)
    .notNull(),
});
