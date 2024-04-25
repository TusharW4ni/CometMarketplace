/*
  Warnings:

  - A unique constraint covering the columns `[socketId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `socketId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "socketId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_socketId_key" ON "User"("socketId");
