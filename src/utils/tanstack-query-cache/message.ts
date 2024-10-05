import "client-only";

import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type { APIResponse, PaginatedResponse, CompleteMessage, MessageSeenMembers } from "@/types";
import type { PaginationMetadata } from "@/utils/general/calculate-pagination";

import { messageKeys } from "@/constants/tanstack-query";

import { updateInfinitePaginatedData } from "@/utils/tanstack-query-cache/helpers";

const addMessage = ({
	message,
	data,
	pagination,
}: {
	message?: CompleteMessage;
	data: PaginatedResponse<CompleteMessage> | undefined;
	pagination: PaginationMetadata;
}) => {
	const items = data?.items ?? [];
	const itemExists = items.some((item) => item.id === message?.id);

	return {
		pagination: {
			...pagination,
			totalItems: !itemExists ? pagination.totalItems + 1 : pagination.totalItems,
		},
		items: message && !itemExists ? [message, ...items] : items,
	};
};

const prependConversationMessage = ({
	conversationId,
	message,
	queryClient,
}: {
	conversationId: string;
	message?: CompleteMessage;
	queryClient: QueryClient;
}) => {
	queryClient.setQueryData<InfiniteData<APIResponse<PaginatedResponse<CompleteMessage>>>>(
		messageKeys.all(conversationId),
		(existingData) =>
			updateInfinitePaginatedData<CompleteMessage>({
				existingData,
				updateFn: (data, pagination) => addMessage({ message, data, pagination }),
			})
	);
};

const updateMessagesSeenMembers = ({
	conversationId,
	messageSeenMembers,
	queryClient,
}: {
	conversationId: string;
	messageSeenMembers?: MessageSeenMembers[];
	queryClient: QueryClient;
}) => {
	queryClient.setQueryData<InfiniteData<APIResponse<PaginatedResponse<CompleteMessage>>>>(
		messageKeys.all(conversationId),
		(existingData) =>
			updateInfinitePaginatedData<CompleteMessage>({
				existingData,
				updateFn: (data, pagination) => {
					const items = data?.items ?? [];
					if (!messageSeenMembers || messageSeenMembers.length === 0) {
						return { data, pagination, items };
					}

					const newItems = items.map((message) => {
						const seenMembers = messageSeenMembers.find((seen) => seen.messageId === message.id);

						if (seenMembers) {
							// Merge the existing seenByMembers with the new ones and remove duplicates using a Set
							const updatedSeenByMembers = Array.from(
								new Set([...message.seenByMembers, ...seenMembers.seenByMembers])
							);

							return { ...message, seenByMembers: updatedSeenByMembers };
						}

						return message;
					});

					return { data, pagination, items: newItems };
				},
			})
	);
};

const updateTextMessageContent = ({
	conversationId,
	messageId,
	messageContent,
	queryClient,
}: {
	conversationId: string;
	messageId: string;
	messageContent: string;
	queryClient: QueryClient;
}) => {
	queryClient.setQueryData<InfiniteData<APIResponse<PaginatedResponse<CompleteMessage>>>>(
		messageKeys.all(conversationId),
		(existingData) =>
			updateInfinitePaginatedData<CompleteMessage>({
				existingData,
				updateFn: (data, pagination) => {
					const items = data?.items ?? [];

					const updatedItems = items.map((message) => {
						if (message.id !== messageId) return message;

						return {
							...message,
							textMessage: {
								...message.textMessage,
								content: messageContent,
								updated_at: new Date(),
							},
						} as CompleteMessage;
					});

					return { data, pagination, items: updatedItems };
				},
			})
	);
};

export { prependConversationMessage, updateMessagesSeenMembers, updateTextMessageContent };
