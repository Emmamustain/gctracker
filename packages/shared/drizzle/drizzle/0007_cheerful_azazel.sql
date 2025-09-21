ALTER TABLE "giftcards" ALTER COLUMN "pin" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "giftcards" ADD COLUMN "balance" numeric;