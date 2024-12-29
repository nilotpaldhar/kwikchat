"use server";

import { getCurrentUser } from "@/data/auth/session";
import { areUsersFriends } from "@/lib/friendship";
import { getConversationBetweenUsers } from "@/data/conversation";
import { createPrivateConversation, broadcastConversation } from "@/lib/conversation";

import { conversationEvents } from "@/constants/pusher-events";

const DEFAULT_FALLBACK_PATH = "/messenger";

const findOrCreateConversationPath = async ({
	friendId,
	fallbackPath,
}: {
	friendId?: string;
	fallbackPath?: string;
}) => {
	// Define the fallback redirect path in case of errors or invalid inputs
	const errorRedirectPath = fallbackPath ?? DEFAULT_FALLBACK_PATH;

	// Return error response if no friendId is provided
	if (!friendId) return { redirectPath: errorRedirectPath, error: true };

	// Get the current user from the session
	const currentUser = await getCurrentUser();
	if (!currentUser || !currentUser.email) return { redirectPath: errorRedirectPath, error: true };

	// Check if the provided friendId is associated with a valid friendship
	const isFriend = await areUsersFriends({ senderId: currentUser.id, receiverId: friendId });
	if (!isFriend) return { redirectPath: errorRedirectPath, error: true };

	try {
		// Extract user IDs for the current user and friend
		const userId1 = currentUser.id;
		const userId2 = friendId;

		// Check if a conversation already exists between the users
		const existingConversation = await getConversationBetweenUsers({ userId1, userId2 });
		if (existingConversation) {
			return {
				redirectPath: `/messenger/chats/${existingConversation.id}`,
				error: false,
			};
		}

		// If no conversation exists, create a new private conversation
		const newConversation = await createPrivateConversation({ userId1, userId2 });

		// Broadcast the creation of the new conversation to both users
		await broadcastConversation<string>({
			receiver: [userId1, userId2],
			eventType: "created",
			eventName: conversationEvents.newConversation,
			payload: newConversation.id,
		});

		return {
			redirectPath: `/messenger/chats/${newConversation.id}`,
			error: false,
		};
	} catch (error) {
		return { redirectPath: errorRedirectPath, error: true };
	}
};

export default findOrCreateConversationPath;
