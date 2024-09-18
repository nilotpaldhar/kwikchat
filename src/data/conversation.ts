import { prisma } from "@/lib/db";

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

// eslint-disable-next-line import/prefer-default-export
export { getConversationBetweenUsers };
