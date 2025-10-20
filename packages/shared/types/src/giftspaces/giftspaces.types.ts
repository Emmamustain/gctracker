import { schema } from "@shared/drizzle";

export type TGiftspace = Omit<
  typeof schema.giftspaces.$inferSelect,
  "password"
>;
export type TReqGiftspace = { giftspaceId: string };
export type TReqGiftspacesByOwner = { owner: string };

export type TCreateGiftspace = typeof schema.giftspaces.$inferInsert;
