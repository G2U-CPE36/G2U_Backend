/*
  Warnings:

  - You are about to drop the column `favoriteItem` on the `Favorite` table. All the data in the column will be lost.
  - Made the column `detail` on table `Category` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "detail" SET NOT NULL;

-- AlterTable
ALTER TABLE "Favorite" DROP COLUMN "favoriteItem";
