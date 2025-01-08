"use server";

import { getCurrentUser } from "@/data/auth/session";
import { areUsersFriends } from "@/lib/friendship";
import { getConversationBetweenUsers } from "@/data/conversation";
import {
	broadcastConversation,
	checkConversationDeleted,
	createPrivateConversation,
	restoreDeletedConversation,
} from "@/lib/conversation";

import { conversationEvents } from "@/constants/pusher-events";

const DEFAULT_FALLBACK_PATH = "/messenger";

const findOrCreateConversationPath = async ({
	friendId,
	fallbackPath,
}: {
	friendId?: string;
	fallbackPath?: string;
}) => {
	// Define the fallback redirect path to use if any error occurs or inputs are invalid.
	const errorRedirectPath = fallbackPath ?? DEFAULT_FALLBACK_PATH;

	// If no friendId is provided, return an error response with the fallback path.
	if (!friendId) return { redirectPath: errorRedirectPath, error: true };

	// Fetch the current user from the session. If no valid user is found, return an error response.
	const currentUser = await getCurrentUser();
	if (!currentUser || !currentUser.email) return { redirectPath: errorRedirectPath, error: true };

	// Verify if the provided friendId corresponds to a valid friendship with the current user.
	const isFriend = await areUsersFriends({ senderId: currentUser.id, receiverId: friendId });
	if (!isFriend) return { redirectPath: errorRedirectPath, error: true };

	try {
		// Assign the IDs of the current user and the friend.
		const userId1 = currentUser.id;
		const userId2 = friendId;

		// Assign the IDs of the current user and the friend.
		const existingConversation = await getConversationBetweenUsers({ userId1, userId2 });

		if (existingConversation) {
			// Check if the conversation was previously deleted by the current user.
			const isConversationDeleted = await checkConversationDeleted({
				conversationId: existingConversation.id,
				userId: userId1,
			});

			// If the conversation was deleted, restore it and notify the current user.
			if (isConversationDeleted) {
				await restoreDeletedConversation({
					conversationId: existingConversation.id,
					userIds: [userId1],
				});
				await broadcastConversation<string>({
					receiver: [userId1],
					eventType: "created",
					eventName: conversationEvents.newConversation,
					payload: existingConversation.id,
				});
			}

			// Redirect to the restored or existing conversation.
			return {
				redirectPath: `/messenger/chats/${existingConversation.id}`,
				error: false,
			};
		}

		// If no conversation exists, create a new private conversation between the users.
		const newConversation = await createPrivateConversation({ userId1, userId2 });

		// Notify both users about the newly created conversation.
		await broadcastConversation<string>({
			receiver: [userId1, userId2],
			eventType: "created",
			eventName: conversationEvents.newConversation,
			payload: newConversation.id,
		});

		// Redirect to the newly created conversation.
		return {
			redirectPath: `/messenger/chats/${newConversation.id}`,
			error: false,
		};
	} catch (error) {
		return { redirectPath: errorRedirectPath, error: true };
	}
};

export default findOrCreateConversationPath;
