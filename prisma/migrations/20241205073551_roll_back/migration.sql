/*
  Warnings:

  - The primary key for the `OpenOrder` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `condition` on the `OpenOrder` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `OpenOrder` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `OpenOrder` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - The `productImage` column on the `OpenOrder` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "OpenOrder" DROP CONSTRAINT "OpenOrder_pkey",
DROP COLUMN "condition",
DROP COLUMN "productId",
ADD COLUMN     "openOrderId" SERIAL NOT NULL,
ALTER COLUMN "price" SET DATA TYPE INTEGER,
DROP COLUMN "productImage",
ADD COLUMN     "productImage" BYTEA,
ADD CONSTRAINT "OpenOrder_pkey" PRIMARY KEY ("openOrderId");
