import { relations } from "drizzle-orm";
import { giftspaces } from "./giftspaces";
import { users } from "./users";
import { giftcards } from "./giftcards";
import { brands } from "./brands";
import { categories } from "./categories";
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

export const giftcardsRelations = relations(giftcards, ({ one }) => ({
  giftspace: one(giftspaces, {
    fields: [giftcards.giftspace],
    references: [giftspaces.id],
  }),
  brand: one(brands, {
    fields: [giftcards.brand],
    references: [brands.id],
  }),
}));

export const brandsRelations = relations(brands, ({ one, many }) => ({
  giftcards: many(giftcards),
  category: one(categories, {
    fields: [brands.category],
    references: [categories.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  brands: many(brands),
}));
