/*
  Warnings:

  - The `productImage` column on the `OpenOrder` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `productImage` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "OpenOrder" DROP COLUMN "productImage",
ADD COLUMN     "productImage" BYTEA;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "productImage",
ADD COLUMN     "productImage" BYTEA;
