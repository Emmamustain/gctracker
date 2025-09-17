import { schema } from "@shared/drizzle";

export type TShowcase = typeof schema.showcases.$inferSelect;
