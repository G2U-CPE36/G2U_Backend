/*
  Warnings:

  - Changed the type of `start` on the `Auction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `end` on the `Auction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Auction" DROP COLUMN "start",
ADD COLUMN     "start" TIMESTAMP(3) NOT NULL,
DROP COLUMN "end",
ADD COLUMN     "end" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "detail" DROP NOT NULL;
