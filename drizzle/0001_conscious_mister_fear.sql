ALTER TABLE "device_locations" RENAME TO "devices_to_locations";--> statement-breakpoint
ALTER TABLE "devices_to_locations" DROP CONSTRAINT "device_locations_device_id_fk_devices_id_fk";
--> statement-breakpoint
ALTER TABLE "devices_to_locations" DROP CONSTRAINT "device_locations_location_id_fk_locations_id_fk";
--> statement-breakpoint
ALTER TABLE "devices_to_locations" DROP CONSTRAINT "device_locations_device_id_fk_location_id_fk_pk";--> statement-breakpoint
ALTER TABLE "devices_to_locations" ADD CONSTRAINT "devices_to_locations_device_id_fk_location_id_fk_pk" PRIMARY KEY("device_id_fk","location_id_fk");--> statement-breakpoint
ALTER TABLE "devices_to_locations" ADD CONSTRAINT "devices_to_locations_device_id_fk_devices_id_fk" FOREIGN KEY ("device_id_fk") REFERENCES "public"."devices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devices_to_locations" ADD CONSTRAINT "devices_to_locations_location_id_fk_locations_id_fk" FOREIGN KEY ("location_id_fk") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;