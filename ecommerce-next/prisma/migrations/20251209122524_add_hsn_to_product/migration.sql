/*
  Warnings:

  - You are about to drop the `CustomerAddress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `hsn_code` on the `products` table. All the data in the column will be lost.
  - Added the required column `available_sizes` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `colors` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size_stock` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CustomerAddress";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "customer_addresses" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "user_id" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    CONSTRAINT "customer_addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_orders" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "user_id" INTEGER NOT NULL,
    "address_id" INTEGER NOT NULL,
    "total" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "orders_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "customer_addresses" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_orders" ("address_id", "created_at", "id", "status", "total", "updated_at", "user_id") SELECT "address_id", "created_at", "id", "status", "total", "updated_at", "user_id" FROM "orders";
DROP TABLE "orders";
ALTER TABLE "new_orders" RENAME TO "orders";
CREATE TABLE "new_products" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "details" TEXT,
    "price" REAL NOT NULL,
    "hsn" TEXT,
    "discount" REAL DEFAULT 0,
    "brand" TEXT,
    "gender" TEXT NOT NULL DEFAULT 'UNISEX',
    "material" TEXT,
    "fabric_care" TEXT,
    "occasion" TEXT,
    "model_number" TEXT,
    "sku" TEXT,
    "available_sizes" TEXT NOT NULL,
    "size_stock" TEXT NOT NULL,
    "colors" TEXT NOT NULL,
    "image_urls" TEXT NOT NULL,
    "weight" REAL,
    "dimensions" TEXT,
    "return_policy" TEXT,
    "seller_notes" TEXT,
    "seller_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "subcategory_id" INTEGER NOT NULL,
    CONSTRAINT "products_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "products_subcategory_id_fkey" FOREIGN KEY ("subcategory_id") REFERENCES "subcategories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_products" ("category_id", "created_at", "description", "details", "id", "image_urls", "price", "seller_id", "subcategory_id", "title", "updated_at") SELECT "category_id", "created_at", "description", "details", "id", "image_urls", "price", "seller_id", "subcategory_id", "title", "updated_at" FROM "products";
DROP TABLE "products";
ALTER TABLE "new_products" RENAME TO "products";
CREATE UNIQUE INDEX "products_sku_key" ON "products"("sku");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
