/*
  Warnings:

  - Added the required column `price` to the `OpenOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OpenOrder" ADD COLUMN     "price" INTEGER NOT NULL;
