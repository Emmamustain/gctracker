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

export const USER_ROLES = {
  ADMIN: "ADMIN",
  MODERATOR: "MODERATOR",
  USER: "USER",
};

export const users = pgTable("users", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  displayName: varchar("display_name", { length: 100 }),
  bio: text("bio"),
  avatarUrl: varchar("avatar_url", { length: 500 }),
  githubUsername: varchar("github_username", { length: 100 }),
  twitterUsername: varchar("twitter_username", { length: 100 }),
  websiteUrl: varchar("website_url", { length: 500 }),
  isVerified: boolean("is_verified").default(false).notNull(),
  isPremium: boolean("is_premium").default(false).notNull(),
  isBanned: boolean("is_banned").default(false).notNull(),
  totalDownloads: integer("total_downloads").default(0).notNull(),
  role: varchar("role", { length: 50 }).default(USER_ROLES.USER).notNull(),
  totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 })
    .default("0.00")
    .notNull(),
  createdAt: timestamp("created_at")
    .default(sql`now()`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`now()`)
    .notNull(),
  lastLoginAt: timestamp("last_login_at"),
});

export const userFollows = pgTable("user_follows", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  followerId: uuid("follower_id")
    .notNull()
    .references(() => users.id),
  followingId: uuid("following_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at")
    .default(sql`now()`)
    .notNull(),
});
