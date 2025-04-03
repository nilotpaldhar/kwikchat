-- AlterTable
ALTER TABLE "DocumentMessage" ADD COLUMN     "caption" TEXT,
ADD COLUMN     "fileName" TEXT,
ADD COLUMN     "fileSizeBytes" INTEGER,
ADD COLUMN     "fileType" TEXT;
