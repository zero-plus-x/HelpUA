/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[telegramUserId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `chatId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `helpTypeId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `optionId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telegramUserId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uiLanguageId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
DROP COLUMN "name",
ADD COLUMN     "chatId" INTEGER NOT NULL,
ADD COLUMN     "helpTypeId" INTEGER NOT NULL,
ADD COLUMN     "optionId" INTEGER NOT NULL,
ADD COLUMN     "telegramUserId" INTEGER NOT NULL,
ADD COLUMN     "uiLanguageId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "Language" (
    "id" SERIAL NOT NULL,
    "language" TEXT NOT NULL,
    "showInUI" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Option" (
    "id" SERIAL NOT NULL,
    "option" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "languageId" INTEGER NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HelpType" (
    "id" SERIAL NOT NULL,
    "helpType" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "languageId" INTEGER NOT NULL,
    "optionId" INTEGER NOT NULL,

    CONSTRAINT "HelpType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_telegramUserId_key" ON "User"("telegramUserId");

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HelpType" ADD CONSTRAINT "HelpType_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HelpType" ADD CONSTRAINT "HelpType_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_uiLanguageId_fkey" FOREIGN KEY ("uiLanguageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_helpTypeId_fkey" FOREIGN KEY ("helpTypeId") REFERENCES "HelpType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
