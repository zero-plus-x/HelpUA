/*
  Warnings:

  - A unique constraint covering the columns `[userId,category]` on the table `Offer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,category]` on the table `Request` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Offer_userId_category_key" ON "Offer"("userId", "category");

-- CreateIndex
CREATE UNIQUE INDEX "Request_userId_category_key" ON "Request"("userId", "category");
