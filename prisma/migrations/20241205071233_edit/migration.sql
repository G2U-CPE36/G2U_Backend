/*
  Warnings:

  - The primary key for the `OpenOrder` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `openOrderId` on the `OpenOrder` table. All the data in the column will be lost.
  - Added the required column `condition` to the `OpenOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OpenOrder" DROP CONSTRAINT "OpenOrder_pkey",
DROP COLUMN "openOrderId",
ADD COLUMN     "condition" TEXT NOT NULL,
ADD COLUMN     "productId" SERIAL NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION,
ADD CONSTRAINT "OpenOrder_pkey" PRIMARY KEY ("productId");
