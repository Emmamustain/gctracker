CREATE TABLE "brandsGiftcards" (
	"id" uuid PRIMARY KEY DEFAULT 'gen_random_uuid()' NOT NULL,
	"brand_id" uuid NOT NULL,
	"giftcard_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categoriesBrands" (
	"id" uuid PRIMARY KEY DEFAULT 'gen_random_uuid()' NOT NULL,
	"category_id" uuid NOT NULL,
	"brand_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "giftspacesGiftcards" (
	"id" uuid PRIMARY KEY DEFAULT 'gen_random_uuid()' NOT NULL,
	"giftspace_id" uuid NOT NULL,
	"giftcard_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "giftspacesUsers" (
	"id" uuid PRIMARY KEY DEFAULT 'gen_random_uuid()' NOT NULL,
	"giftspace_id" uuid NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "brandsGiftcards" ADD CONSTRAINT "brandsGiftcards_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brandsGiftcards" ADD CONSTRAINT "brandsGiftcards_giftcard_id_giftcards_id_fk" FOREIGN KEY ("giftcard_id") REFERENCES "public"."giftcards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categoriesBrands" ADD CONSTRAINT "categoriesBrands_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categoriesBrands" ADD CONSTRAINT "categoriesBrands_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "giftspacesGiftcards" ADD CONSTRAINT "giftspacesGiftcards_giftspace_id_giftspaces_id_fk" FOREIGN KEY ("giftspace_id") REFERENCES "public"."giftspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "giftspacesGiftcards" ADD CONSTRAINT "giftspacesGiftcards_giftcard_id_giftcards_id_fk" FOREIGN KEY ("giftcard_id") REFERENCES "public"."giftcards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "giftspacesUsers" ADD CONSTRAINT "giftspacesUsers_giftspace_id_giftspaces_id_fk" FOREIGN KEY ("giftspace_id") REFERENCES "public"."giftspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "giftspacesUsers" ADD CONSTRAINT "giftspacesUsers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;