/*
  Warnings:

  - You are about to drop the `_OfferToRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_OfferToRequest" DROP CONSTRAINT "_OfferToRequest_A_fkey";

-- DropForeignKey
ALTER TABLE "_OfferToRequest" DROP CONSTRAINT "_OfferToRequest_B_fkey";

-- DropTable
DROP TABLE "_OfferToRequest";

-- CreateTable
CREATE TABLE "_OfferToRequestCandidate" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OfferToRequestCandidate_AB_unique" ON "_OfferToRequestCandidate"("A", "B");

-- CreateIndex
CREATE INDEX "_OfferToRequestCandidate_B_index" ON "_OfferToRequestCandidate"("B");

-- AddForeignKey
ALTER TABLE "_OfferToRequestCandidate" ADD FOREIGN KEY ("A") REFERENCES "Offer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OfferToRequestCandidate" ADD FOREIGN KEY ("B") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;
