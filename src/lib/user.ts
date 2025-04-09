import "server-only";

import { prisma } from "@/lib/db";
import { pusherServer } from "@/lib/pusher/server";
import { getFriendsOfUser } from "@/data/friendship";
import { getUserConversationList } from "@/data/conversation";

import { friendEvents } from "@/constants/pusher-events";
import generateFriendChannel from "@/utils/pusher/generate-friend-channel";

/**
 * Updates the online status of a user in the database.
 */
const setUserOnlineStatus = async ({ userId, isOnline }: { userId: string; isOnline: boolean }) => {
	try {
		await prisma.user.update({
			where: { id: userId },
			data: {
				isOnline: isOnline,
				lastSeen: isOnline ? null : new Date(),
			},
		});
		return true;
	} catch (error) {
		return false;
	}
};

/**
 * Notifies friends of a user's status change (signin or logout).
 */
const broadcastUserStatus = async ({
	userId,
	action,
}: {
	userId: string;
	action: "signin" | "logout";
}) => {
	try {
		const event = action === "signin" ? friendEvents.online : friendEvents.offline;

		const [friends, conversations] = await Promise.all([
			getFriendsOfUser({ userId, isOnline: true }),
			getUserConversationList({ userId }),
		]);
		const friendIds = friends.map((friend) => friend.id);
		const conversationIds = conversations.map((conversation) => conversation.id);

		pusherServer.trigger(
			[
				...friendIds.map((id) => generateFriendChannel({ uid: id, channelType: "default" })),
				...friendIds.map((id) =>
					generateFriendChannel({ uid: id, channelType: "filtered_friends" })
				),
				...conversationIds.map((id) => generateFriendChannel({ uid: id, channelType: "default" })),
			],
			event,
			userId
		);
	} catch (error) {
		console.error("Failed to notify friends of user status change.");
	}
};

export { setUserOnlineStatus, broadcastUserStatus };
