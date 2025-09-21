ALTER TABLE "brands" ADD COLUMN "category" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "giftcards" ADD COLUMN "giftspace" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "giftcards" ADD COLUMN "brand" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "giftspaces" ADD COLUMN "owner" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "brands" ADD CONSTRAINT "brands_category_categories_id_fk" FOREIGN KEY ("category") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "giftcards" ADD CONSTRAINT "giftcards_giftspace_giftspaces_id_fk" FOREIGN KEY ("giftspace") REFERENCES "public"."giftspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "giftcards" ADD CONSTRAINT "giftcards_brand_brands_id_fk" FOREIGN KEY ("brand") REFERENCES "public"."brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "giftspaces" ADD CONSTRAINT "giftspaces_owner_users_id_fk" FOREIGN KEY ("owner") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;