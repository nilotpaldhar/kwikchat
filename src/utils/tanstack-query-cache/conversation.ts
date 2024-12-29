import "client-only";

import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type {
	APIResponse,
	ConversationWithMetadata,
	GroupOverview,
	PaginatedResponse,
	UserWithoutPassword,
	CompleteMessage,
	RecentMessage,
} from "@/types";
import type { PaginationMetadata } from "@/utils/general/calculate-pagination";

import { conversationKeys } from "@/constants/tanstack-query";
import { updateInfinitePaginatedData } from "@/utils/tanstack-query-cache/helpers";

/**
 * Adds a new conversation to the list, updating pagination and ensuring uniqueness.
 */
const addConversation = ({
	conversation,
	data,
	pagination,
}: {
	conversation: ConversationWithMetadata;
	data: PaginatedResponse<ConversationWithMetadata> | undefined;
	pagination: PaginationMetadata;
}) => {
	const items = data?.items ?? [];
	const itemExists = items.some((item) => item.id === conversation.id);

	return {
		pagination: {
			...pagination,
			totalItems: !itemExists ? pagination.totalItems + 1 : pagination.totalItems,
		},
		items: !itemExists ? [conversation, ...items] : items,
	};
};

/**
 * Updates the recent message of a conversation.
 */
const updateRecentMessage = ({
	message,
	data,
	pagination,
}: {
	message: CompleteMessage | RecentMessage;
	data: PaginatedResponse<ConversationWithMetadata> | undefined;
	pagination: PaginationMetadata;
}) => {
	const items = data?.items ?? [];
	const itemToUpdate = items.find((conversation) => conversation.id === message.conversationId);
	const filterdItems = items.filter((conversation) => conversation.id !== message.conversationId);

	let updatedConversation = null;

	if (itemToUpdate) {
		const { recentMessage, updatedAt, ...rest } = itemToUpdate;
		updatedConversation = {
			...rest,
			updatedAt: new Date(),
			recentMessage: {
				id: message.id,
				type: message.type,
				senderId: message.senderId,
				conversationId: message.id,
				createdAt: message.createdAt,
				updatedAt: message.updatedAt,
				isDeleted: message.isDeleted,
				textMessage: message.textMessage,
				imageMessage: message.imageMessage,
			},
		};
	}

	return {
		data,
		pagination,
		items: updatedConversation ? [updatedConversation, ...filterdItems] : items,
	};
};

/**
 * Updates the participant's online status and last seen time in the query cache for a conversation.
 */
const updateParticipantStatus = ({
	conversationId,
	friendId,
	isOnline,
	lastSeen,
	queryClient,
}: {
	conversationId: string;
	friendId: string;
	isOnline: boolean;
	lastSeen: Date | null;
	queryClient: QueryClient;
}) => {
	queryClient.setQueryData<APIResponse<UserWithoutPassword>>(
		conversationKeys.participant(conversationId),
		(existingData) => {
			if (!existingData) return existingData;

			// Create a copy of the existing participant data
			const participant = { ...existingData.data };

			// If the participant matches the friendId, update their online status and last seen time
			if (participant && participant.id === friendId) {
				participant.lastSeen = lastSeen;
				participant.isOnline = isOnline;
			}

			return { ...existingData, data: participant as UserWithoutPassword };
		}
	);
};

/**
 * Updates the members in a group conversation.
 * This function modifies the member in the group overview data stored in the query cache.
 */
const updateGroupMembers = ({
	conversationId,
	members,
	queryClient,
}: {
	conversationId: string;
	members: { total: number; online: number };
	queryClient: QueryClient;
}) => {
	queryClient.setQueryData<APIResponse<GroupOverview>>(
		conversationKeys.groupDetails(conversationId),
		(existingData) => {
			if (!existingData) return existingData;

			const groupOverview = { ...existingData.data };

			if (groupOverview && groupOverview.members) {
				groupOverview.members = members;
			}

			return { ...existingData, data: groupOverview as GroupOverview };
		}
	);
};

/**
 * Prepends a new conversation to the paginated list, ensuring proper updates based on filters.
 */
const prependConversation = ({
	conversation,
	queryClient,
}: {
	conversation: ConversationWithMetadata;
	queryClient: QueryClient;
}) => {
	queryClient.setQueryData<InfiniteData<APIResponse<PaginatedResponse<ConversationWithMetadata>>>>(
		conversationKeys.filtered("all"),
		(existingData) =>
			updateInfinitePaginatedData<ConversationWithMetadata>({
				existingData,
				updateFn: (data, pagination) => addConversation({ conversation, data, pagination }),
			})
	);

	if (conversation.isGroup) {
		queryClient.setQueryData<
			InfiniteData<APIResponse<PaginatedResponse<ConversationWithMetadata>>>
		>(conversationKeys.filtered("group"), (existingData) =>
			updateInfinitePaginatedData<ConversationWithMetadata>({
				existingData,
				updateFn: (data, pagination) => addConversation({ conversation, data, pagination }),
			})
		);
	}

	if (conversation.unreadMessages > 0) {
		queryClient.setQueryData<
			InfiniteData<APIResponse<PaginatedResponse<ConversationWithMetadata>>>
		>(conversationKeys.filtered("unread"), (existingData) =>
			updateInfinitePaginatedData<ConversationWithMetadata>({
				existingData,
				updateFn: (data, pagination) => addConversation({ conversation, data, pagination }),
			})
		);
	}
};

/**
 * Updates the conversation by replacing the outdated conversation with the new one.
 */
const updateConversation = ({
	conversation,
	queryClient,
}: {
	conversation: ConversationWithMetadata;
	queryClient: QueryClient;
}) => {
	const updateFn = (
		data: PaginatedResponse<ConversationWithMetadata> | undefined,
		pagination: PaginationMetadata
	) => {
		const items = data?.items ?? [];
		const filterdItems = items.filter((c) => c.id !== conversation.id);
		return { data, pagination, items: [conversation, ...filterdItems] };
	};

	queryClient.setQueryData<InfiniteData<APIResponse<PaginatedResponse<ConversationWithMetadata>>>>(
		conversationKeys.filtered("all"),
		(existingData) =>
			updateInfinitePaginatedData<ConversationWithMetadata>({ existingData, updateFn })
	);

	if (conversation.isGroup) {
		queryClient.setQueryData<
			InfiniteData<APIResponse<PaginatedResponse<ConversationWithMetadata>>>
		>(conversationKeys.filtered("group"), (existingData) =>
			updateInfinitePaginatedData<ConversationWithMetadata>({ existingData, updateFn })
		);
	}

	queryClient.setQueryData<InfiniteData<APIResponse<PaginatedResponse<ConversationWithMetadata>>>>(
		conversationKeys.filtered("unread"),
		(existingData) =>
			updateInfinitePaginatedData<ConversationWithMetadata>({ existingData, updateFn })
	);
};

/**
 * Updates the recent message for a conversation across different filters.
 */
const updateConversationRecentMessage = ({
	message,
	queryClient,
}: {
	message: CompleteMessage | RecentMessage;
	queryClient: QueryClient;
}) => {
	queryClient.setQueryData<InfiniteData<APIResponse<PaginatedResponse<ConversationWithMetadata>>>>(
		conversationKeys.filtered("all"),
		(existingData) =>
			updateInfinitePaginatedData<ConversationWithMetadata>({
				existingData,
				updateFn: (data, pagination) => updateRecentMessage({ message, data, pagination }),
			})
	);

	queryClient.setQueryData<InfiniteData<APIResponse<PaginatedResponse<ConversationWithMetadata>>>>(
		conversationKeys.filtered("group"),
		(existingData) =>
			updateInfinitePaginatedData<ConversationWithMetadata>({
				existingData,
				updateFn: (data, pagination) => updateRecentMessage({ message, data, pagination }),
			})
	);

	queryClient.setQueryData<InfiniteData<APIResponse<PaginatedResponse<ConversationWithMetadata>>>>(
		conversationKeys.filtered("unread"),
		(existingData) =>
			updateInfinitePaginatedData<ConversationWithMetadata>({
				existingData,
				updateFn: (data, pagination) => updateRecentMessage({ message, data, pagination }),
			})
	);
};

/**
 * Updates the unread messages count for a conversation.
 */
const updateConversationUnreadMessagesCount = ({
	conversationId,
	unreadMessages,
	queryClient,
}: {
	conversationId: string;
	unreadMessages?: number;
	queryClient: QueryClient;
}) => {
	const updateFn = (
		data: PaginatedResponse<ConversationWithMetadata> | undefined,
		pagination: PaginationMetadata
	) => {
		const items = data?.items ?? [];
		const updatedItems = items.map((conversation) => {
			if (conversation.id !== conversationId) return conversation;
			return {
				...conversation,
				unreadMessages: unreadMessages ?? conversation.unreadMessages,
			};
		});

		return { data, pagination, items: updatedItems };
	};

	queryClient.setQueryData<InfiniteData<APIResponse<PaginatedResponse<ConversationWithMetadata>>>>(
		conversationKeys.filtered("all"),
		(existingData) =>
			updateInfinitePaginatedData<ConversationWithMetadata>({ existingData, updateFn })
	);

	queryClient.setQueryData<InfiniteData<APIResponse<PaginatedResponse<ConversationWithMetadata>>>>(
		conversationKeys.filtered("group"),
		(existingData) =>
			updateInfinitePaginatedData<ConversationWithMetadata>({ existingData, updateFn })
	);

	queryClient.setQueryData<InfiniteData<APIResponse<PaginatedResponse<ConversationWithMetadata>>>>(
		conversationKeys.filtered("unread"),
		(existingData) =>
			updateInfinitePaginatedData<ConversationWithMetadata>({
				existingData,
				updateFn: (data, pagination) => {
					const items = data?.items ?? [];
					const updatedItems =
						unreadMessages === 0
							? items.filter((conversation) => conversation.id !== conversationId)
							: items.map((conversation) => {
									if (conversation.id !== conversationId) return conversation;
									return {
										...conversation,
										unreadMessages: unreadMessages ?? conversation.unreadMessages,
									};
								});

					return { data, pagination, items: updatedItems };
				},
			})
	);
};

export {
	updateParticipantStatus,
	updateGroupMembers,
	prependConversation,
	updateConversation,
	updateConversationRecentMessage,
	updateConversationUnreadMessagesCount,
};
