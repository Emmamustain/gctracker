import { schema } from "@shared/drizzle";

export type TBrand = Omit<typeof schema.brands.$inferSelect, "password">;
export type TReqBrand = { brandId: string };
export type TReqBrandByCategory = { category: string };
