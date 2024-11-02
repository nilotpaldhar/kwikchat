import type { FriendWithFriendship } from "@/types";
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

/**
 * Checks if a user has a friendship with any of the specified friend IDs.
 */
const hasAnyFriendshipWithUser = async ({
	userId,
	friendIds,
}: {
	userId: string;
	friendIds: string[];
}) => {
	const friendshipExists = await prisma.friendship.findMany({
		where: {
			OR: [
				{ userId: userId, friendId: { in: friendIds } },
				{ friendId: userId, userId: { in: friendIds } },
			],
		},
		select: { userId: true, friendId: true },
	});

	const friendStatuses = friendIds.reduce<Record<string, boolean>>((acc, friendId) => {
		const isFriend = friendshipExists.some(
			(friendship) =>
				(friendship.userId === userId && friendship.friendId === friendId) ||
				(friendship.friendId === userId && friendship.userId === friendId)
		);
		acc[friendId] = isFriend;
		return acc;
	}, {});

	const hasNoFriends = Object.values(friendStatuses).some((status) => !status);

	return { friendStatuses, hasNoFriends };
};

/**
 * Removes duplicate friends from an array based on the friend ID.
 */
const removeDuplicateFriends = (friends: FriendWithFriendship[]): FriendWithFriendship[] => {
	const seenIds = new Set<string>();

	return friends.filter((friend) => {
		if (seenIds.has(friend.id)) {
			return false;
		} else {
			seenIds.add(friend.id);
			return true;
		}
	});
};

/**
 * Deletes the friendship relationship and any associated accepted friend requests
 * between the current user and the specified friend.
 */
const deleteFriendship = async ({ userId, friendId }: { userId: string; friendId: string }) => {
	try {
		// Delete the friendship relationship between the current user and the specified friend.
		const deletedFriendship = await prisma.friendship.deleteMany({
			where: {
				OR: [
					{ userId: userId, friendId: friendId },
					{ userId: friendId, friendId: userId },
				],
			},
		});

		// Delete any accepted friend requests related to the specified friend.
		const deletedRequests = await prisma.friendRequest.deleteMany({
			where: {
				OR: [
					{ senderId: userId, receiverId: friendId, status: "accepted" },
					{ senderId: friendId, receiverId: userId, status: "accepted" },
				],
			},
		});

		// Check if the friendship or friend request deletion affected any records.
		const isFriendshipDeleted = deletedFriendship.count > 0;
		const isRequestDeleted = deletedRequests.count > 0;

		return isFriendshipDeleted || isRequestDeleted;
	} catch (error) {
		return false;
	}
};

export { areUsersFriends, hasAnyFriendshipWithUser, removeDuplicateFriends, deleteFriendship };
