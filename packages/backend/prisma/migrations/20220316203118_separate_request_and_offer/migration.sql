/*
  Warnings:

  - You are about to drop the column `role` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the `Match` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_helpeeOfferId_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_helperOfferId_fkey";

-- AlterTable
ALTER TABLE "Offer" DROP COLUMN "role";

-- DropTable
DROP TABLE "Match";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Request" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "category" "Category" NOT NULL,
    "languages" "SpokenLanguage"[],

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OfferToRequest" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OfferToRequest_AB_unique" ON "_OfferToRequest"("A", "B");

-- CreateIndex
CREATE INDEX "_OfferToRequest_B_index" ON "_OfferToRequest"("B");

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OfferToRequest" ADD FOREIGN KEY ("A") REFERENCES "Offer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OfferToRequest" ADD FOREIGN KEY ("B") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;
