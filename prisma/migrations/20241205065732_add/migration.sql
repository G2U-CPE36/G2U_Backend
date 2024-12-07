/*
  Warnings:

  - The `productImage` column on the `OpenOrder` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "OpenOrder" DROP COLUMN "productImage",
ADD COLUMN     "productImage" BYTEA[];
