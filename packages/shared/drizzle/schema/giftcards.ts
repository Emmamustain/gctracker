import { sql } from "drizzle-orm";

import {
  pgTable,
  timestamp,
  uuid,
  varchar,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";
import { giftspaces } from "./giftspaces";
import { brands } from "./brands";

export const giftcards = pgTable("giftcards", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }),
  code: varchar("code", { length: 255 }).notNull(),
  pin: varchar("pin", { length: 255 }),
  balance: decimal("balance"),
  favorite: boolean("favorite").default(false),
  discarded: boolean("discarded").default(false),
  giftspace: uuid("giftspace")
    .notNull()
    .references(() => giftspaces.id),
  brand: uuid("brand")
    .notNull()
    .references(() => brands.id),
  createdAt: timestamp("created_at")
    .default(sql`now()`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`now()`)
    .notNull(),
});
