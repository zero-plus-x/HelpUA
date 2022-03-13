/*
  Warnings:

  - Added the required column `optionId` to the `HelpType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HelpType" ADD COLUMN     "optionId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "HelpType" ADD CONSTRAINT "HelpType_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
