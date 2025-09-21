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
} from "./relations";
import { users } from "./users";

export const schema = {
  // tables
  users,
  brands,
  categories,
  giftcards,
  giftspaces,
  usersRelations,
  brandsRelations,
  categoriesRelations,
  giftcardsRelations,
  giftspacesRelations,
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
  usersRelations,
  brandsRelations,
  categoriesRelations,
  giftcardsRelations,
  giftspacesRelations,
  giftspacesUsers,
  giftspacesGiftcards,
  brandsGiftcards,
  categoriesBrands,
};
