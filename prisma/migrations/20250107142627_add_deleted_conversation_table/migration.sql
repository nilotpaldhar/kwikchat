-- CreateTable
CREATE TABLE "DeletedConversation" (
    "id" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "conversationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "DeletedConversation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DeletedConversation_conversationId_idx" ON "DeletedConversation"("conversationId");

-- CreateIndex
CREATE INDEX "DeletedConversation_userId_idx" ON "DeletedConversation"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DeletedConversation_userId_conversationId_key" ON "DeletedConversation"("userId", "conversationId");

-- AddForeignKey
ALTER TABLE "DeletedConversation" ADD CONSTRAINT "DeletedConversation_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeletedConversation" ADD CONSTRAINT "DeletedConversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
