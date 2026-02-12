CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"giftcard_id" uuid NOT NULL,
	"amount" numeric NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_giftcard_id_giftcards_id_fk" FOREIGN KEY ("giftcard_id") REFERENCES "public"."giftcards"("id") ON DELETE cascade ON UPDATE no action;