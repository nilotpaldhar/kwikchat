/*
  Warnings:

  - You are about to drop the column `created_at` on the `ImageMessage` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `ImageMessage` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `MessageSeenStatus` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `MessageSeenStatus` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `TextMessage` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `TextMessage` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `ImageMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `MessageSeenStatus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `TextMessage` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MessageReactionType" AS ENUM ('like', 'love', 'laugh', 'sad', 'pray', 'dislike', 'angry');

-- AlterTable
ALTER TABLE "ImageMessage" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "MessageSeenStatus" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "TextMessage" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "MessageReaction" (
    "id" TEXT NOT NULL,
    "type" "MessageReactionType" NOT NULL,
    "emoji" TEXT NOT NULL,
    "emojiImageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "messageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "MessageReaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MessageReaction_messageId_userId_key" ON "MessageReaction"("messageId", "userId");

-- AddForeignKey
ALTER TABLE "MessageReaction" ADD CONSTRAINT "MessageReaction_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageReaction" ADD CONSTRAINT "MessageReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
