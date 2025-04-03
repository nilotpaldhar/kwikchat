/*
  Warnings:

  - You are about to drop the column `fileSizeBytes` on the `DocumentMessage` table. All the data in the column will be lost.
  - You are about to drop the column `caption` on the `Media` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DocumentMessage" DROP COLUMN "fileSizeBytes",
ADD COLUMN     "fileSize" INTEGER;

-- AlterTable
ALTER TABLE "ImageMessage" ADD COLUMN     "caption" TEXT,
ADD COLUMN     "fileName" TEXT,
ADD COLUMN     "fileSize" INTEGER,
ADD COLUMN     "fileType" TEXT,
ADD COLUMN     "tempDataUrl" TEXT;

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "caption";
