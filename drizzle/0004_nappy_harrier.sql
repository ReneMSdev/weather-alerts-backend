ALTER TABLE "locations" ADD COLUMN "place_id" varchar(100);--> statement-breakpoint
ALTER TABLE "locations" ADD CONSTRAINT "locations_place_id_unique" UNIQUE("place_id");