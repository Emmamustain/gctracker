ALTER TABLE "brandsGiftcards" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "categoriesBrands" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "giftspacesGiftcards" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "giftspacesUsers" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();