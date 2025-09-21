DROP TABLE "categories" CASCADE;--> statement-breakpoint
DROP TABLE "collection_showcases" CASCADE;--> statement-breakpoint
DROP TABLE "collections" CASCADE;--> statement-breakpoint
DROP TABLE "comment_likes" CASCADE;--> statement-breakpoint
DROP TABLE "comments" CASCADE;--> statement-breakpoint
DROP TABLE "curated_collections" CASCADE;--> statement-breakpoint
DROP TABLE "curated_showcases" CASCADE;--> statement-breakpoint
DROP TABLE "downloads" CASCADE;--> statement-breakpoint
DROP TABLE "notifications" CASCADE;--> statement-breakpoint
DROP TABLE "purchases" CASCADE;--> statement-breakpoint
DROP TABLE "reports" CASCADE;--> statement-breakpoint
DROP TABLE "showcase_images" CASCADE;--> statement-breakpoint
DROP TABLE "showcase_likes" CASCADE;--> statement-breakpoint
DROP TABLE "showcase_tags" CASCADE;--> statement-breakpoint
DROP TABLE "showcases" CASCADE;--> statement-breakpoint
DROP TABLE "tags" CASCADE;--> statement-breakpoint
DROP TABLE "user_follows" CASCADE;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "bio";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "github_username";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "twitter_username";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "website_url";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "is_verified";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "is_premium";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "is_banned";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "total_downloads";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "total_earnings";