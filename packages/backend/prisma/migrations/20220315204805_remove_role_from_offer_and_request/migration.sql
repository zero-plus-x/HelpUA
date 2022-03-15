/*
  Warnings:

  - You are about to drop the column `role` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Request` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Offer" DROP COLUMN "role";

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "role";
