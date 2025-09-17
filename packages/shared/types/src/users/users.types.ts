import { schema } from "@shared/drizzle";

export type TUser = Omit<typeof schema.users.$inferSelect, "password">;
export type TReqUser = { userId: string; email: string };
