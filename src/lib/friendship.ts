import { prisma } from "@/lib/db";

/**
 * This function checks if two users are friends by looking for a friendship record
 * in the database where either user is the sender or receiver.
 */
const areUsersFriends = async ({
	senderId,
	receiverId,
}: {
	senderId: string;
	receiverId: string;
}) => {
	const friendship = await prisma.friendship.findFirst({
		where: {
			OR: [
				{ userId: senderId, friendId: receiverId },
				{ userId: receiverId, friendId: senderId },
			],
		},
	});

	return !!friendship;
};

// eslint-disable-next-line import/prefer-default-export
export { areUsersFriends };
