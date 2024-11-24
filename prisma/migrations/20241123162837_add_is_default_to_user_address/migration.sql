/*
  Warnings:

  - A unique constraint covering the columns `[userId,isDefault]` on the table `UserAddress` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "UserAddress" ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "UserAddress_userId_isDefault_key" ON "UserAddress"("userId", "isDefault");
