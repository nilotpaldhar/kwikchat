import "client-only";

import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type { APIResponse, CompleteMessage, PaginatedResponse } from "@/types";

import { messageKeys } from "@/constants/tanstack-query";

import { getInfiniteQueryData } from "@/utils/tanstack-query-cache/helpers";

const optimisticClearConversation = async ({
	conversationId,
	queryClient,
}: {
	conversationId: string;
	queryClient: QueryClient;
}) => {
	// Cancel ongoing queries related to messages to ensure cache consistency
	await queryClient.cancelQueries({ queryKey: messageKeys.all(conversationId) });
	await queryClient.cancelQueries({ queryKey: messageKeys.starred(conversationId) });

	const messagesData = getInfiniteQueryData<CompleteMessage>({
		keys: messageKeys.all(conversationId),
		queryClient,
	});
	const starredMessagesData = getInfiniteQueryData<CompleteMessage>({
		keys: messageKeys.starred(conversationId),
		queryClient,
	});

	queryClient.setQueryData<InfiniteData<APIResponse<PaginatedResponse<CompleteMessage>>>>(
		messageKeys.all(conversationId),
		(existingData) => {
			if (!existingData) return existingData;
			return { ...existingData, pages: [] };
		}
	);
	queryClient.setQueryData<InfiniteData<APIResponse<PaginatedResponse<CompleteMessage>>>>(
		messageKeys.starred(conversationId),
		(existingData) => {
			if (!existingData) return existingData;
			return { ...existingData, pages: [] };
		}
	);

	return { messagesData, starredMessagesData };
};

const optimisticConversationError = async ({
	conversationId,
	context,
	queryClient,
}: {
	conversationId: string;
	context?: {
		messagesData?: InfiniteData<APIResponse<PaginatedResponse<CompleteMessage>>>;
		starredMessagesData?: InfiniteData<APIResponse<PaginatedResponse<CompleteMessage>>>;
	};
	queryClient: QueryClient;
}) => {
	if (!context) return;
	queryClient.setQueryData(messageKeys.all(conversationId), context.messagesData);
	queryClient.setQueryData(messageKeys.starred(conversationId), context.starredMessagesData);
};

const refetchOptimisticConversation = async ({
	conversationId,
	queryClient,
}: {
	conversationId: string;
	queryClient: QueryClient;
}) => {
	queryClient.invalidateQueries({ queryKey: messageKeys.all(conversationId) });
	queryClient.invalidateQueries({ queryKey: messageKeys.starred(conversationId) });
};

export { optimisticClearConversation, optimisticConversationError, refetchOptimisticConversation };
