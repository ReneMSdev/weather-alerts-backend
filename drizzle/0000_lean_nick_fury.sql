CREATE TABLE "locations" (
	"id" serial PRIMARY KEY NOT NULL,
	"city_name" varchar(100) NOT NULL,
	"state" varchar(2) NOT NULL,
	"lat" numeric(8, 5) NOT NULL,
	"lon" numeric(8, 5) NOT NULL,
	"grid_id" text NOT NULL,
	"grid_x" integer NOT NULL,
	"grid_y" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
