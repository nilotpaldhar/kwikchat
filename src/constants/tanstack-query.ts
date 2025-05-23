import type { ConversationsFilterType, MediaAttachmentFilterType } from "@/types";

/**
 * Refetch interval for polling online friends data in milliseconds (30 seconds).
 */
export const ONLINE_FRIENDS_REFETCH_INTERVAL = 30000; // 3 seconds

/**
 * User query keys
 *
 * Contains keys used to uniquely identify queries related to user data.
 */
export const userKeys = {
	current: ["current_user"] as const,
};

/**
 * Friend query keys
 *
 * Contains keys used to uniquely identify queries related to friend data.
 */
export const friendKeys = {
	all: ["friends"] as const,
	online: () => [...friendKeys.all, "online_friends"] as const,
	searchAll: (query: string) => [...friendKeys.all, query] as const,
	searchOnline: (query: string) => [...friendKeys.online(), query] as const,
	filtered: (filters: string) => [...friendKeys.all, "filtered_friends", filters] as const,
};

/**
 * Friend request query keys
 *
 * Contains keys used to uniquely identify queries related to friend request data.
 */
export const friendRequestKeys = {
	all: ["friend_requests"] as const,
	recent: () => [...friendRequestKeys.all, "recent_friend_requests"] as const,
	search: (query: string) => [...friendRequestKeys.all, query] as const,
	pendingCount: () => [...friendRequestKeys.all, "pending_friend_request_count"] as const,
};

/**
 * Blocked user query keys
 *
 * Contains keys used to uniquely identify queries related to blocked user data.
 */
export const blockedUserKeys = {
	all: ["blocked_users"] as const,
	search: (query: string) => [...blockedUserKeys.all, query] as const,
};

/**
 * Conversation query keys
 *
 * Contains keys used to uniquely identify queries related to conversations.
 */
export const conversationKeys = {
	all: ["conversations"] as const,
	filtered: (filters: ConversationsFilterType) =>
		[...conversationKeys.all, "filtered_conversations", filters] as const,
	participant: (id: string) => [...conversationKeys.all, "participant", id] as const,
	groupDetails: (id: string) => [...conversationKeys.all, "group_details", id] as const,
	groupMembership: (id: string) => [...conversationKeys.all, "group_Membership", id] as const,
};

/**
 * Message query keys
 *
 * Contains keys used to uniquely identify queries related to messages.
 */
export const messageKeys = {
	base: ["messages"] as const,
	all: (conversationId: string) => [...messageKeys.base, "all", conversationId] as const,
	starred: (conversationId: string) => [...messageKeys.base, "starred", conversationId] as const,
};

/**
 * Group member query keys
 *
 * Contains keys used to uniquely identify queries related to group members.
 */
export const groupMemberKeys = {
	base: ["group_members"] as const,
	all: (conversationId: string) => [...groupMemberKeys.base, "all", conversationId] as const,
};

/**
 * Message media query keys
 *
 * Contains keys used to uniquely identify queries related to media attachments in messages.
 */
export const mediaAttachmentKeys = {
	base: ["media_attachments"] as const,
	all: (conversationId: string) => [...mediaAttachmentKeys.base, conversationId] as const,
	filtered: (conversationId: string, filters: MediaAttachmentFilterType) =>
		[...mediaAttachmentKeys.base, conversationId, filters] as const,
	forMessage: (conversationId: string, messageId: string) =>
		[...mediaAttachmentKeys.base, conversationId, "for_message", messageId] as const,
};
