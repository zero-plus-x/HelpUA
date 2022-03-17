/*
  Warnings:

  - A unique constraint covering the columns `[matchedRequestId]` on the table `Offer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Offer" ADD COLUMN     "lastCandidateFound" TIMESTAMP(3),
ADD COLUMN     "matchedRequestId" INTEGER;

-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Offer_matchedRequestId_key" ON "Offer"("matchedRequestId");

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_matchedRequestId_fkey" FOREIGN KEY ("matchedRequestId") REFERENCES "Request"("id") ON DELETE SET NULL ON UPDATE CASCADE;
