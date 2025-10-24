import { schema } from "@shared/drizzle";

export type TGiftcard = typeof schema.giftcards.$inferSelect;
export type TReqGiftcard = { giftcardId: string };
export type TReqGiftcardsByGiftspace = { giftspace: string };
export type TCreateGiftcard = typeof schema.giftcards.$inferInsert;
export type TUpdateCard = Partial<TCreateGiftcard>;
