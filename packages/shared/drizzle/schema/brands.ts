import { sql } from "drizzle-orm";

import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { giftcards } from "./giftcards";
import { categories } from "./categories";

export const brands = pgTable("brands", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }),
  imageUrl: varchar("image_url", { length: 500 }),
  category: uuid("category")
    .notNull()
    .references(() => categories.id),
});

export const brandsGiftcards = pgTable("brandsGiftcards", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  brandId: uuid("brand_id")
    .notNull()
    .references(() => brands.id),
  giftcardId: uuid("giftcard_id")
    .notNull()
    .references(() => giftcards.id),
});
