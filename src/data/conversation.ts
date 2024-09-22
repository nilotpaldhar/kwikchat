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

export { getConversationBetweenUsers, getConversationById, getConversationByIdAndUserId };
