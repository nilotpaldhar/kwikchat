import { prisma } from "@/lib/db";

/**
 *  Creates a new private one-on-one conversation between two users.
 */
const createPrivateConversation = async ({
	userId1,
	userId2,
}: {
	userId1: string;
	userId2: string;
}) => {
	const conversation = await prisma.conversation.create({
		data: {
			isGroup: false,
			createdBy: userId1,
			members: {
				create: [{ user: { connect: { id: userId1 } } }, { user: { connect: { id: userId2 } } }],
			},
		},
	});

	return conversation;
};

/**
 * Clears a conversation for a specific user by marking messages as deleted
 * and removing any starred messages linked to that conversation.
 */
const clearConversation = async ({
	conversationId,
	userId,
}: {
	conversationId: string;
	userId: string;
}) => {
	try {
		// Fetch the conversation that matches the given conversationId and includes the user as a member.
		// Also, retrieve the list of message IDs in that conversation.
		const conversation = await prisma.conversation.findFirst({
			where: {
				id: conversationId,
				members: { some: { userId } }, // Ensure the user is a member of the conversation.
			},
			include: {
				messages: { select: { id: true } }, // Include only message IDs in the response.
			},
		});

		// If the conversation doesn't exist or the user is not a member, return false.
		if (!conversation) return false;

		// Create an array of data to mark each message as deleted for the user.
		const deletionData = conversation.messages.map((message) => ({
			messageId: message.id,
			userId,
		}));

		// Execute a transaction to mark messages as deleted and remove starred messages in the conversation for the user.
		await prisma.$transaction([
			prisma.deletedMessage.createMany({
				data: deletionData,

				// Avoid creating duplicates if the messages are already marked as deleted
				skipDuplicates: true,
			}),

			// Delete starred messages in this conversation for the user.
			prisma.starredMessage.deleteMany({
				where: { message: { conversationId }, userId },
			}),
		]);

		return true;
	} catch (error) {
		return false;
	}
};

export { createPrivateConversation, clearConversation };
