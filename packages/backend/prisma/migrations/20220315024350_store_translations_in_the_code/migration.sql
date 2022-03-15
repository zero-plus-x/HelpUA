/*
  Warnings:

  - You are about to drop the column `helpTypeId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `optionId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `uiLanguageId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `HelpType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Language` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Option` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `uiLanguage` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UILanguage" AS ENUM ('ENGLISH', 'RUSSIAN', 'UKRAINIAN');

-- CreateEnum
CREATE TYPE "SpokenLanguage" AS ENUM ('ENGLISH', 'RUSSIAN', 'UKRAINIAN', 'SWEDISH', 'POLISH', 'ROMANIAN', 'GERMAN');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('HELPEE', 'HELPER');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('URGENT_CARE', 'TRANSPORTATION', 'LOCAL_INFORMATION', 'ACCOMODATION', 'MEDICAL_HELP');

-- DropForeignKey
ALTER TABLE "HelpType" DROP CONSTRAINT "HelpType_languageId_fkey";

-- DropForeignKey
ALTER TABLE "HelpType" DROP CONSTRAINT "HelpType_optionId_fkey";

-- DropForeignKey
ALTER TABLE "Option" DROP CONSTRAINT "Option_languageId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_helpTypeId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_optionId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_uiLanguageId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "helpTypeId",
DROP COLUMN "optionId",
DROP COLUMN "uiLanguageId",
ADD COLUMN     "uiLanguage" "UILanguage" NOT NULL;

-- DropTable
DROP TABLE "HelpType";

-- DropTable
DROP TABLE "Language";

-- DropTable
DROP TABLE "Option";

-- CreateTable
CREATE TABLE "Offer" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "role" "Role" NOT NULL,
    "category" "Category" NOT NULL,
    "languages" "SpokenLanguage"[],

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Request" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "role" "Role" NOT NULL,
    "caterogy" "Category" NOT NULL,
    "languages" "SpokenLanguage"[],

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "offerId" INTEGER NOT NULL,
    "requestId" INTEGER NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
