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
import { users } from "./users";
import { showcases } from "./showcases";
import { comments } from "./interactions";

export const collections = pgTable("collections", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  isPublic: boolean("is_public").default(false).notNull(),
  showcaseCount: integer("showcase_count").default(0).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`now()`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`now()`)
    .notNull(),
});

export const collectionShowcases = pgTable("collection_showcases", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  collectionId: uuid("collection_id")
    .notNull()
    .references(() => collections.id),
  showcaseId: uuid("showcase_id")
    .notNull()
    .references(() => showcases.id),
  addedAt: timestamp("added_at")
    .default(sql`now()`)
    .notNull(),
});

export const reports = pgTable("reports", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  reporterId: uuid("reporter_id")
    .notNull()
    .references(() => users.id),
  showcaseId: uuid("showcase_id").references(() => showcases.id),
  commentId: uuid("comment_id").references(() => comments.id),
  reason: varchar("reason", { length: 100 }).notNull(),
  description: text("description"),
  status: varchar("status", { length: 20 }).default("pending").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`now()`)
    .notNull(),
});
