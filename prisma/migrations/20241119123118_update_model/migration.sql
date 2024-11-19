/*
  Warnings:

  - The primary key for the `UserLog` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `editType` on the `UserLog` table. All the data in the column will be lost.
  - You are about to drop the column `editValue` on the `UserLog` table. All the data in the column will be lost.
  - You are about to drop the column `userLogId` on the `UserLog` table. All the data in the column will be lost.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `action` to the `UserLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_phone_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL,
ALTER COLUMN "firstName" DROP NOT NULL,
ALTER COLUMN "lastName" DROP NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UserLog" DROP CONSTRAINT "UserLog_pkey",
DROP COLUMN "editType",
DROP COLUMN "editValue",
DROP COLUMN "userLogId",
ADD COLUMN     "action" TEXT NOT NULL,
ADD COLUMN     "logId" SERIAL NOT NULL,
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "UserLog_pkey" PRIMARY KEY ("logId");
