import { prisma } from "@/lib/db";

/**
 * Retrieves an existing one-on-one conversation between two users.
 */
const getConversationBetweenUsers = async ({
	userId1,
	userId2,
}: {
	userId1: string;
	userId2: string;
}) => {
	try {
		const conversation = await prisma.conversation.findFirst({
			where: {
				isGroup: false,
				members: { every: { OR: [{ userId: userId1 }, { userId: userId2 }] } },
			},
		});

		return conversation;
	} catch (error) {
		return null;
	}
};

/**
 * Retrieves a conversation by its unique ID.
 */
const getConversationById = async (id: string) => {
	try {
		const conversation = await prisma.conversation.findUnique({
			where: { id },
		});

		return conversation;
	} catch (error) {
		return null;
	}
};

/**
 * Retrieves a conversation by its ID and user ID.
 */
const getConversationByIdAndUserId = async ({ id, userId }: { id: string; userId: string }) => {
	try {
		const conversation = await prisma.conversation.findFirst({
			where: { id, members: { some: { userId } } },
		});

		return conversation;
	} catch (error) {
		return null;
	}
};

/**
 * Retrieves the first conversation for a given conversation ID
 * and checks if the current user is a member of that conversation.
 */
const getUserConversation = async ({
	conversationId,
	userId,
}: {
	conversationId: string;
	userId: string;
}) => {
	try {
		const conversation = await prisma.conversation.findFirst({
			where: {
				id: conversationId,
				members: { some: { userId } },
			},
		});

		return conversation;
	} catch (error) {
		return null;
	}
};

/**
 * Retrieves a list of conversations for a specified user.
 * This function queries the database for conversations in which the user is a member
 * and returns all matching conversations.
 */
const getUserConversationList = async ({ userId }: { userId: string }) => {
	try {
		const conversations = await prisma.conversation.findMany({
			where: {
				members: { some: { userId } },
			},
		});

		return conversations;
	} catch (error) {
		return [];
	}
};

export {
	getConversationBetweenUsers,
	getConversationById,
	getConversationByIdAndUserId,
	getUserConversation,
	getUserConversationList,
};
