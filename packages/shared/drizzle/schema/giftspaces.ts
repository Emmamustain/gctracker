import { sql } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";
import { giftcards } from "./giftcards";

export const giftspaces = pgTable("giftspaces", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  password: varchar("password", { length: 255 }),
  name: varchar("display_name", { length: 100 }).notNull(),
  owner: uuid("owner")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at")
    .default(sql`now()`)
    .notNull(),
});

export const giftspacesUsers = pgTable("giftspacesUsers", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  giftspaceId: uuid("giftspace_id")
    .notNull()
    .references(() => giftspaces.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
});

export const giftspacesGiftcards = pgTable("giftspacesGiftcards", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  giftspaceId: uuid("giftspace_id")
    .notNull()
    .references(() => giftspaces.id),
  giftcardId: uuid("giftcard_id")
    .notNull()
    .references(() => giftcards.id),
});
