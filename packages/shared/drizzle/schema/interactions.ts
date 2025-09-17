import { sql } from "drizzle-orm";
import {
  boolean,
  decimal,
  inet,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { showcases } from "./showcases";

export const comments = pgTable("comments", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  showcaseId: uuid("showcase_id")
    .notNull()
    .references(() => showcases.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  parentCommentId: uuid("parent_comment_id").references((): any => comments.id),
  content: text("content").notNull(),
  isEdited: boolean("is_edited").default(false).notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  likesCount: integer("likes_count").default(0).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`now()`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`now()`)
    .notNull(),
});

export const commentLikes = pgTable("comment_likes", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  commentId: uuid("comment_id")
    .notNull()
    .references(() => comments.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at")
    .default(sql`now()`)
    .notNull(),
});

export const purchases = pgTable("purchases", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  showcaseId: uuid("showcase_id")
    .notNull()
    .references(() => showcases.id),
  amount: decimal("amount", { precision: 8, scale: 2 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }),
  paymentId: varchar("payment_id", { length: 255 }),
  status: varchar("status", { length: 20 }).default("completed").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`now()`)
    .notNull(),
});

export const downloads = pgTable("downloads", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id), // Can be null
  showcaseId: uuid("showcase_id")
    .notNull()
    .references(() => showcases.id),
  ipAddress: inet("ip_address"),
  userAgent: text("user_agent"),
  downloadToken: varchar("download_token", { length: 255 }).unique(),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at")
    .default(sql`now()`)
    .notNull(),
});
