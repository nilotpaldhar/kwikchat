export const friendEvents = {
	delete: "delete_friend" as const,
	online: "online_friend" as const,
	offline: "offline_friend" as const,
	block: "block_friend" as const,
};

export const friendRequestEvents = {
	incoming: "incoming_friend_request" as const,
	delete: "delete_friend_request" as const,
	accept: "accept_friend_request" as const,
	reject: "reject_friend_request" as const,
};

export const conversationEvents = {
	newConversation: "conversation_new" as const,
	updateConversation: "conversation_updated" as const,
	updateConversationUnreadMessages: "conversation_updated_unread_messages" as const,
	newMessage: "new_message" as const,
	updateMessage: "update_message" as const,
	seenMessage: "seen_message" as const,
	createReaction: "create_reaction" as const,
	updateReaction: "update_reaction " as const,
	removeReaction: "remove_reaction " as const,
};
