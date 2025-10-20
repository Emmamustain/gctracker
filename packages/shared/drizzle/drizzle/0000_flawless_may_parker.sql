CREATE TABLE "brands" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255),
	"image_url" varchar(500),
	"category" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "brandsGiftcards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand_id" uuid NOT NULL,
	"giftcard_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"color" varchar(255),
	"icon_url" varchar(500)
);
--> statement-breakpoint
CREATE TABLE "categoriesBrands" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"brand_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "giftcards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255),
	"code" varchar(255) NOT NULL,
	"pin" varchar(255),
	"balance" numeric,
	"favorite" boolean DEFAULT false,
	"giftspace" uuid NOT NULL,
	"brand" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "giftspaces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"password" varchar(255),
	"display_name" varchar(100),
	"owner" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "giftspacesGiftcards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"giftspace_id" uuid NOT NULL,
	"giftcard_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "giftspacesUsers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"giftspace_id" uuid NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"display_name" varchar(100),
	"avatar_url" varchar(500),
	"role" varchar(50) DEFAULT 'USER' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"last_login_at" timestamp,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "brands" ADD CONSTRAINT "brands_category_categories_id_fk" FOREIGN KEY ("category") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brandsGiftcards" ADD CONSTRAINT "brandsGiftcards_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brandsGiftcards" ADD CONSTRAINT "brandsGiftcards_giftcard_id_giftcards_id_fk" FOREIGN KEY ("giftcard_id") REFERENCES "public"."giftcards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categoriesBrands" ADD CONSTRAINT "categoriesBrands_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categoriesBrands" ADD CONSTRAINT "categoriesBrands_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "giftcards" ADD CONSTRAINT "giftcards_giftspace_giftspaces_id_fk" FOREIGN KEY ("giftspace") REFERENCES "public"."giftspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "giftcards" ADD CONSTRAINT "giftcards_brand_brands_id_fk" FOREIGN KEY ("brand") REFERENCES "public"."brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "giftspaces" ADD CONSTRAINT "giftspaces_owner_users_id_fk" FOREIGN KEY ("owner") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "giftspacesGiftcards" ADD CONSTRAINT "giftspacesGiftcards_giftspace_id_giftspaces_id_fk" FOREIGN KEY ("giftspace_id") REFERENCES "public"."giftspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "giftspacesGiftcards" ADD CONSTRAINT "giftspacesGiftcards_giftcard_id_giftcards_id_fk" FOREIGN KEY ("giftcard_id") REFERENCES "public"."giftcards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "giftspacesUsers" ADD CONSTRAINT "giftspacesUsers_giftspace_id_giftspaces_id_fk" FOREIGN KEY ("giftspace_id") REFERENCES "public"."giftspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "giftspacesUsers" ADD CONSTRAINT "giftspacesUsers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;