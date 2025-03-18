import "client-only";

import { MessageType } from "@prisma/client";
import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type {
	APIResponse,
	CompleteMessage,
	PaginatedResponse,
	ConversationWithMetadata,
	RecentMessage,
} from "@/types";
import type { MessagePayloadSchemaType } from "@/schemas";

import { messageKeys, conversationKeys } from "@/constants/tanstack-query";

import { generateTempId } from "@/utils/general/temp-id-generator";
import { getInfiniteQueryData } from "@/utils/tanstack-query-cache/helpers";
import { updateConversationRecentMessage } from "@/utils/tanstack-query-cache/conversation";

const generateTempRecentMessage = ({
	conversationId,
	senderId,
	messagePayload,
}: {
	conversationId: string;
	senderId: string;
	messagePayload: MessagePayloadSchemaType;
}): RecentMessage => {
	const tempRecentMsgId = generateTempId();
	const messageType = messagePayload.messageType;

	// Function to generate text message
	const createTextMessage = () => {
		if (messageType === MessageType.text) {
			return {
				id: generateTempId(),
				messageId: tempRecentMsgId,
				content: messagePayload.message,
				createdAt: new Date(),
				updatedAt: new Date(),
			};
		}

		return null;
	};

	// Function to generate document message
	const createDocumentMessage = () => {
		if (messageType === MessageType.document) {
			return {
				id: generateTempId(),
				fileName: messagePayload.message.document.fileName,
				fileType: messagePayload.message.document.fileType,
				fileSizeBytes: messagePayload.message.document.fileSize.raw,
				caption: messagePayload.message.caption ?? null,
				createdAt: new Date(),
				updatedAt: new Date(),
				messageId: tempRecentMsgId,
				mediaId: generateTempId(),
			};
		}

		return null;
	};

	// Function to generate image message
	const createImageMessage = () => {
		if (messageType === MessageType.image) {
			return messagePayload.message.map(() => ({
				id: generateTempId(),
				createdAt: new Date(),
				updatedAt: new Date(),
				messageId: tempRecentMsgId,
				mediaId: generateTempId(),
			}));
		}

		return [];
	};

	return {
		id: tempRecentMsgId,
		conversationId,
		type: messageType,
		senderId,
		createdAt: new Date(),
		updatedAt: new Date(),
		isDeleted: false,
		systemMessage: null,
		textMessage: createTextMessage(),
		imageMessage: createImageMessage(),
		documentMessage: createDocumentMessage(),
	};
};

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

const optimisticUpdateConversationRecentMsg = async ({
	conversationId,
	senderId,
	messagePayload,
	queryClient,
}: {
	conversationId: string;
	senderId: string;
	messagePayload?: MessagePayloadSchemaType;

	queryClient: QueryClient;
}) => {
	await queryClient.cancelQueries({ queryKey: conversationKeys.filtered("all") });
	await queryClient.cancelQueries({ queryKey: conversationKeys.filtered("group") });
	await queryClient.cancelQueries({ queryKey: conversationKeys.filtered("unread") });

	const conversationData = getInfiniteQueryData<ConversationWithMetadata>({
		keys: conversationKeys.filtered("all"),
		queryClient,
	});

	const groupConversationData = getInfiniteQueryData<ConversationWithMetadata>({
		keys: conversationKeys.filtered("group"),
		queryClient,
	});

	const unreadConversationData = getInfiniteQueryData<ConversationWithMetadata>({
		keys: conversationKeys.filtered("unread"),
		queryClient,
	});

	if (!messagePayload) return { conversationData, groupConversationData, unreadConversationData };

	const tempRecentMessage = generateTempRecentMessage({ conversationId, senderId, messagePayload });
	updateConversationRecentMessage({ message: tempRecentMessage, queryClient });

	return { conversationData, groupConversationData, unreadConversationData };
};

const optimisticClearConversationError = async ({
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

const optimisticUpdateConversationRecentMsgError = async ({
	context,
	queryClient,
}: {
	context?: {
		conversationData?: InfiniteData<APIResponse<PaginatedResponse<ConversationWithMetadata>>>;
		groupConversationData?: InfiniteData<APIResponse<PaginatedResponse<ConversationWithMetadata>>>;
		unreadConversationData?: InfiniteData<APIResponse<PaginatedResponse<ConversationWithMetadata>>>;
	};
	queryClient: QueryClient;
}) => {
	if (!context) return;
	queryClient.setQueryData(conversationKeys.filtered("all"), context.conversationData);
	queryClient.setQueryData(conversationKeys.filtered("group"), context.groupConversationData);
	queryClient.setQueryData(conversationKeys.filtered("unread"), context.unreadConversationData);
};

const refetchOptimisticConversation = async ({
	conversationId,
	opsType,
	queryClient,
}: {
	conversationId: string;
	opsType: "clear_conversation_messages" | "send_message";
	queryClient: QueryClient;
}) => {
	if (opsType === "clear_conversation_messages") {
		queryClient.invalidateQueries({ queryKey: messageKeys.all(conversationId) });
		queryClient.invalidateQueries({ queryKey: messageKeys.starred(conversationId) });
	}

	if (opsType === "send_message") {
		queryClient.invalidateQueries({ queryKey: conversationKeys.filtered("all") });
		queryClient.invalidateQueries({ queryKey: conversationKeys.filtered("group") });
		queryClient.invalidateQueries({ queryKey: conversationKeys.filtered("unread") });
	}
};

export {
	optimisticClearConversation,
	optimisticUpdateConversationRecentMsg,
	optimisticClearConversationError,
	optimisticUpdateConversationRecentMsgError,
	refetchOptimisticConversation,
};
