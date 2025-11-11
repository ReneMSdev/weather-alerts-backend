ALTER TABLE "locations" RENAME COLUMN "city_name" TO "city_id";--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "city" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "locations" ADD CONSTRAINT "locations_city_id_unique" UNIQUE("city_id");