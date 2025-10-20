import { sql } from "drizzle-orm";

import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { brands } from "./brands";

export const categories = pgTable("categories", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  color: varchar("color", { length: 255 }),
  iconUrl: varchar("icon_url", { length: 500 }),
});

export const categoriesBrands = pgTable("categoriesBrands", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id),
  brandId: uuid("brand_id")
    .notNull()
    .references(() => brands.id),
});
