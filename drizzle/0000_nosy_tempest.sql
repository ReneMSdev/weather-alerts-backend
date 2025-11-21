CREATE TABLE "device_locations" (
	"device_id_fk" integer NOT NULL,
	"location_id_fk" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "device_locations_device_id_fk_location_id_fk_pk" PRIMARY KEY("device_id_fk","location_id_fk")
);
--> statement-breakpoint
CREATE TABLE "devices" (
	"id" serial PRIMARY KEY NOT NULL,
	"device_id" varchar(36) NOT NULL,
	"platform" varchar(10),
	"os_version" varchar(50),
	"push_token" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "devices_device_id_unique" UNIQUE("device_id")
);
--> statement-breakpoint
CREATE TABLE "locations" (
	"id" serial PRIMARY KEY NOT NULL,
	"city_id" varchar(100) NOT NULL,
	"city" varchar(100) NOT NULL,
	"state" varchar(2) NOT NULL,
	"place_id" varchar(100),
	"lat" numeric(8, 5) NOT NULL,
	"lon" numeric(8, 5) NOT NULL,
	"grid_id" text NOT NULL,
	"grid_x" integer NOT NULL,
	"grid_y" integer NOT NULL,
	"timezone" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "locations_city_id_unique" UNIQUE("city_id"),
	CONSTRAINT "locations_place_id_unique" UNIQUE("place_id")
);
--> statement-breakpoint
ALTER TABLE "device_locations" ADD CONSTRAINT "device_locations_device_id_fk_devices_id_fk" FOREIGN KEY ("device_id_fk") REFERENCES "public"."devices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "device_locations" ADD CONSTRAINT "device_locations_location_id_fk_locations_id_fk" FOREIGN KEY ("location_id_fk") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;