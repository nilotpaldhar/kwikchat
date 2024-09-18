import { prisma } from "@/lib/db";

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

// eslint-disable-next-line import/prefer-default-export
export { createPrivateConversation };
