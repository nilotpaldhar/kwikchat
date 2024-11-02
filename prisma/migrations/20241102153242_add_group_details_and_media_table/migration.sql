/*
  Warnings:

  - You are about to drop the column `name` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `ImageMessage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[mediaId]` on the table `ImageMessage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mediaId` to the `ImageMessage` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('image', 'video');

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "ImageMessage" DROP COLUMN "url",
ADD COLUMN     "mediaId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "GroupDetails" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "conversationId" TEXT NOT NULL,
    "iconId" TEXT,

    CONSTRAINT "GroupDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "filePath" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "fileType" "FileType" NOT NULL,
    "height" INTEGER,
    "width" INTEGER,
    "thumbnailUrl" TEXT,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GroupDetails_conversationId_key" ON "GroupDetails"("conversationId");

-- CreateIndex
CREATE UNIQUE INDEX "GroupDetails_iconId_key" ON "GroupDetails"("iconId");

-- CreateIndex
CREATE UNIQUE INDEX "ImageMessage_mediaId_key" ON "ImageMessage"("mediaId");

-- AddForeignKey
ALTER TABLE "ImageMessage" ADD CONSTRAINT "ImageMessage_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupDetails" ADD CONSTRAINT "GroupDetails_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupDetails" ADD CONSTRAINT "GroupDetails_iconId_fkey" FOREIGN KEY ("iconId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
