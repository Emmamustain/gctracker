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
  users: many(users),
  giftcards: many(giftcards),
  owner: one(users, {
    fields: [giftspaces.id],
    references: [users.id],
  }),
}));

export const giftcardsRelations = relations(giftcards, ({ one }) => ({
  giftspace: one(giftspaces, {
    fields: [giftcards.id],
    references: [giftspaces.id],
  }),
  brand: one(brands, {
    fields: [giftcards.id],
    references: [brands.id],
  }),
}));

export const brandsRelations = relations(brands, ({ one, many }) => ({
  giftcards: many(giftcards),
  category: one(categories, {
    fields: [brands.id],
    references: [categories.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  brands: many(brands),
}));
