import { schema } from "@shared/drizzle";

export type TCategory = typeof schema.categories.$inferSelect;
export type TReqCategory = { categoryId: string };
