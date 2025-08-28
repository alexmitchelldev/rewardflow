ALTER TABLE "transactions" RENAME COLUMN "product_type_id" TO "product_id";--> statement-breakpoint
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_product_type_id_product_types_id_fk";
--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;