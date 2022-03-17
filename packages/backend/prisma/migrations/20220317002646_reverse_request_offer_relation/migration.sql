/*
  Warnings:

  - You are about to drop the column `matchedRequestId` on the `Offer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[matchedOfferId]` on the table `Request` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Offer" DROP CONSTRAINT "Offer_matchedRequestId_fkey";

-- DropIndex
DROP INDEX "Offer_matchedRequestId_key";

-- AlterTable
ALTER TABLE "Offer" DROP COLUMN "matchedRequestId";

-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "matchedOfferId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Request_matchedOfferId_key" ON "Request"("matchedOfferId");

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_matchedOfferId_fkey" FOREIGN KEY ("matchedOfferId") REFERENCES "Offer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
