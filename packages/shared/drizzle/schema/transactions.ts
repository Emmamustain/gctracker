import { sql } from "drizzle-orm";

import {
  pgTable,
  timestamp,
  uuid,
  decimal,
  text,
} from "drizzle-orm/pg-core";
import { giftcards } from "./giftcards";

export const transactions = pgTable("transactions", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  giftcardId: uuid("giftcard_id")
    .notNull()
    .references(() => giftcards.id, { onDelete: "cascade" }),
  amount: decimal("amount").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at")
    .default(sql`now()`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`now()`)
    .notNull(),
});