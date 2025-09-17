import { schema } from "@shared/drizzle";
import { TTag } from "../tags/tags.types";

export type TCuratedShowcase = typeof schema.curatedShowcases.$inferSelect;
export type TCuratedShowcaseFlattened = {
  curatedShowcase: Pick<
    TCuratedShowcase,
    "id" | "thumbnailUrl" | "title" | "startDate" | "endDate"
  >;
  showcase: Pick<
    typeof schema.showcases.$inferSelect,
    | "id"
    | "userId"
    | "thumbnailUrl"
    | "title"
    | "slug"
    | "price"
    | "osCompatibility"
    | "shellCompatibility"
  >;
  users: Pick<
    typeof schema.users.$inferSelect,
    "username" | "avatarUrl" | "isVerified" | "role"
  >;
  tags: TTag[];
  category: Pick<
    typeof schema.categories.$inferSelect,
    "name" | "slug" | "color"
  >;
};
export type TCuratedCollection = typeof schema.curatedCollections.$inferSelect;
