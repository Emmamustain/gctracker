import { schema } from "@shared/drizzle";

export type TCategory = Omit<typeof schema.categories.$inferSelect, "password">;
export type TReqCategory = { categoryId: string };
