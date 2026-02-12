import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { transactions } from "@shared/drizzle/schema";

export type TTransaction = InferSelectModel<typeof transactions>;
export type TCreateTransaction = InferInsertModel<typeof transactions>;
export type TUpdateTransaction = Partial<TCreateTransaction>;