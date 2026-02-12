import { relations } from "drizzle-orm";
import { giftspaces } from "./giftspaces";
import { users } from "./users";
import { giftcards } from "./giftcards";
import { brands } from "./brands";
import { categories } from "./categories";
import { transactions } from "./transactions";
export const usersRelations = relations(users, ({ many }) => ({
  giftspaces: many(giftspaces),
}));

export const giftspacesRelations = relations(giftspaces, ({ one, many }) => ({
  giftcards: many(giftcards),
  owner: one(users, {
    fields: [giftspaces.owner],
    references: [users.id],
  }),
}));

export const giftcardsRelations = relations(giftcards, ({ one, many }) => ({
  giftspace: one(giftspaces, {
    fields: [giftcards.giftspace],
    references: [giftspaces.id],
  }),
  brand: one(brands, {
    fields: [giftcards.brand],
    references: [brands.id],
  }),
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  giftcard: one(giftcards, {
    fields: [transactions.giftcardId],
    references: [giftcards.id],
  }),
}));

export const brandsRelations = relations(brands, ({ many }) => ({
  giftcards: many(giftcards),
  categories: many(categories),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  brands: many(brands),
}));
