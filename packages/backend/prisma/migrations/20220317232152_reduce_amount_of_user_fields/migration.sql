/*
  Warnings:

  - You are about to drop the column `telegramUsername` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `uiLanguage` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "telegramUsername",
DROP COLUMN "uiLanguage";

-- DropEnum
DROP TYPE "UILanguage";
