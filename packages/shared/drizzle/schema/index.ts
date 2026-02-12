import { brands, brandsGiftcards } from "./brands";
import { categories, categoriesBrands } from "./categories";
import { giftcards } from "./giftcards";
import { giftspaces, giftspacesGiftcards, giftspacesUsers } from "./giftspaces";
import {
  usersRelations,
  brandsRelations,
  categoriesRelations,
  giftcardsRelations,
  giftspacesRelations,
  transactionsRelations,
} from "./relations";
import { transactions } from "./transactions";
import { users } from "./users";

export const schema = {
  // tables
  users,
  brands,
  categories,
  giftcards,
  giftspaces,
  transactions,
  usersRelations,
  brandsRelations,
  categoriesRelations,
  giftcardsRelations,
  giftspacesRelations,
  transactionsRelations,
  giftspacesUsers,
  giftspacesGiftcards,
  brandsGiftcards,
  categoriesBrands,
} as const;

export {
  // tables
  users,
  brands,
  categories,
  giftcards,
  giftspaces,
  transactions,
  usersRelations,
  brandsRelations,
  categoriesRelations,
  giftcardsRelations,
  giftspacesRelations,
  transactionsRelations,
  giftspacesUsers,
  giftspacesGiftcards,
  brandsGiftcards,
  categoriesBrands,
};
