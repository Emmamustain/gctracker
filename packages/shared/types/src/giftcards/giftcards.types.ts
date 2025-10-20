import { schema } from "@shared/drizzle";

export type TGiftcard = Omit<typeof schema.giftcards.$inferSelect, "password">;
export type TReqGiftcard = { giftcardId: string };
export type TReqGiftcardsByGiftspace = { giftspace: string };
export type TCreateGiftcard = typeof schema.giftcards.$inferInsert;
