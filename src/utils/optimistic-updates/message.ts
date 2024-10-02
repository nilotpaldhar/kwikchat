import "client-only";

import { nanoid } from "nanoid";

import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type { APIResponse, CompleteMessage, PaginatedResponse } from "@/types";

import { messageKeys } from "@/constants/tanstack-query";

import { prependConversationMessage } from "@/utils/tanstack-query-cache/message";

import { getInfiniteQueryData } from "@/utils/tanstack-query-cache/helpers";

const createCompleteMessage = ({
	conversationId,
	senderId,
	message,
}: {
	conversationId: string;
	senderId: string;
	message: string;
}) => {
	const newMessage: CompleteMessage = {
		id: nanoid(),
		conversationId,
		senderId,
		createdAt: new Date(),
		updatedAt: new Date(),
		type: "text",
		seenByMembers: [],
		textMessage: {
			id: nanoid(),
			messageId: nanoid(),
			content: message,
			created_at: new Date(),
			updated_at: new Date(),
		},
		imageMessage: null,
	};

	return newMessage;
};

const optimisticSendPrivateMessage = async ({
	conversationId,
	senderId,
	message,
	queryClient,
}: {
	conversationId: string;
	senderId: string;
	message: string;
	queryClient: QueryClient;
}) => {
	const newMessage = createCompleteMessage({ conversationId, senderId, message });

	// Cancel ongoing queries related to messages to ensure cache consistency
	await queryClient.cancelQueries({ queryKey: messageKeys.all(conversationId) });

	const messagesData = getInfiniteQueryData<CompleteMessage>({
		keys: messageKeys.all(conversationId),
		queryClient,
	});

	prependConversationMessage({ conversationId, message: newMessage, queryClient });

	return { messagesData };
};

const optimisticSendPrivateMessageError = async ({
	conversationId,
	context,
	queryClient,
}: {
	conversationId: string;
	context?: {
		messagesData?: InfiniteData<APIResponse<PaginatedResponse<CompleteMessage>>>;
	};
	queryClient: QueryClient;
}) => {
	if (!context) return;
	queryClient.setQueryData(messageKeys.all(conversationId), context.messagesData);
};

const refetchOptimisticPrivateMessages = ({
	conversationId,
	queryClient,
}: {
	conversationId: string;
	queryClient: QueryClient;
}) => {
	queryClient.invalidateQueries({ queryKey: messageKeys.all(conversationId) });
};

export {
	optimisticSendPrivateMessage,
	optimisticSendPrivateMessageError,
	refetchOptimisticPrivateMessages,
};
