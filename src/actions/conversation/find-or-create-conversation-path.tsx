"use server";

import { getCurrentUser } from "@/data/auth/session";
import { areUsersFriends } from "@/lib/friendship";
import { getConversationBetweenUsers } from "@/data/conversation";
import { createPrivateConversation } from "@/lib/conversation";

const DEFAULT_FALLBACK_PATH = "/messenger";

const findOrCreateConversationPath = async ({
	friendId,
	fallbackPath,
}: {
	friendId?: string;
	fallbackPath?: string;
}) => {
	const errorRedirectPath = fallbackPath ?? DEFAULT_FALLBACK_PATH;

	if (!friendId) return { redirectPath: errorRedirectPath, error: true };

	// Get the current user from the session
	const currentUser = await getCurrentUser();
	if (!currentUser || !currentUser.email) return { redirectPath: errorRedirectPath, error: true };

	const isFriend = await areUsersFriends({ senderId: currentUser.id, receiverId: friendId });
	if (!isFriend) return { redirectPath: errorRedirectPath, error: true };

	try {
		const userId1 = currentUser.id;
		const userId2 = friendId;

		const existingConversation = await getConversationBetweenUsers({ userId1, userId2 });
		if (existingConversation)
			return {
				redirectPath: `/messenger/chats/${existingConversation.id}`,
				error: false,
			};

		const newConversation = await createPrivateConversation({ userId1, userId2 });
		return {
			redirectPath: `/messenger/chats/${newConversation.id}`,
			error: false,
		};
	} catch (error) {
		return { redirectPath: errorRedirectPath, error: true };
	}
};

export default findOrCreateConversationPath;
