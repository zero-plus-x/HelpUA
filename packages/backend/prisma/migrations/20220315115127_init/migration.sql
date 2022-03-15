-- CreateEnum
CREATE TYPE "UILanguage" AS ENUM ('ENGLISH', 'RUSSIAN', 'UKRAINIAN');

-- CreateEnum
CREATE TYPE "SpokenLanguage" AS ENUM ('ENGLISH', 'RUSSIAN', 'UKRAINIAN', 'SWEDISH', 'POLISH', 'ROMANIAN', 'GERMAN');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('HELPEE', 'HELPER');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('URGENT_CARE', 'TRANSPORTATION', 'LOCAL_INFORMATION', 'ACCOMODATION', 'MEDICAL_HELP');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "telegramUserId" INTEGER NOT NULL,
    "chatId" INTEGER NOT NULL,
    "uiLanguage" "UILanguage" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

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

-- CreateIndex
CREATE UNIQUE INDEX "User_telegramUserId_key" ON "User"("telegramUserId");

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
