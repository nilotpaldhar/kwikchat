-- DropForeignKey
ALTER TABLE "ImageMessage" DROP CONSTRAINT "ImageMessage_mediaId_fkey";

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "imageMessageId" TEXT;

-- CreateTable
CREATE TABLE "DocumentMessage" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "messageId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,

    CONSTRAINT "DocumentMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DocumentMessage_messageId_key" ON "DocumentMessage"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentMessage_mediaId_key" ON "DocumentMessage"("mediaId");

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_imageMessageId_fkey" FOREIGN KEY ("imageMessageId") REFERENCES "ImageMessage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentMessage" ADD CONSTRAINT "DocumentMessage_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentMessage" ADD CONSTRAINT "DocumentMessage_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
