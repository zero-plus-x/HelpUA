/*
  Warnings:

  - You are about to drop the column `offerId` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `requestId` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the `Request` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `helpeeOfferId` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `helperOfferId` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `Offer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_offerId_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_requestId_fkey";

-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_userId_fkey";

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "offerId",
DROP COLUMN "requestId",
ADD COLUMN     "helpeeOfferId" INTEGER NOT NULL,
ADD COLUMN     "helperOfferId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Offer" ADD COLUMN     "role" "Role" NOT NULL;

-- DropTable
DROP TABLE "Request";

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_helperOfferId_fkey" FOREIGN KEY ("helperOfferId") REFERENCES "Offer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_helpeeOfferId_fkey" FOREIGN KEY ("helpeeOfferId") REFERENCES "Offer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
