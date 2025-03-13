/*
  Warnings:

  - You are about to drop the column `imageMessageId` on the `Media` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_imageMessageId_fkey";

-- DropIndex
DROP INDEX "ImageMessage_messageId_key";

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "imageMessageId";

-- AddForeignKey
ALTER TABLE "ImageMessage" ADD CONSTRAINT "ImageMessage_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
