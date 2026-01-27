/*
  Warnings:

  - A unique constraint covering the columns `[userId,classId]` on the table `Waitlist` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Waitlist_userId_classId_key" ON "Waitlist"("userId", "classId");
