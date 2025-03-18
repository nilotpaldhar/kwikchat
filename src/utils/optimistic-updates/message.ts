import "client-only";

import { MessageType, type MessageReaction, type MessageReactionType } from "@prisma/client";
import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type { APIResponse, CompleteMessage, PaginatedResponse, UserProfile } from "@/types";
import type { MessagePayloadSchemaType } from "@/schemas";

import { messageKeys } from "@/constants/tanstack-query";

import {
	prependConversationMessage,
	updateTextMessageContent,
	appendMessageReaction,
	updateMessageReaction,
	removeMessageReaction,
	toggleMessageStarStatus,
	appendStarredMessage,
	removeStarredMessage,
	deleteMessage,
} from "@/utils/tanstack-query-cache/message";

import { generateTempId } from "@/utils/general/temp-id-generator";
import { getInfiniteQueryData } from "@/utils/tanstack-query-cache/helpers";

const generateTempMessage = ({
	conversationId,
	sender,
	messagePayload,
}: {
	conversationId: string;
	sender: UserProfile;
	messagePayload: MessagePayloadSchemaType;
}): CompleteMessage => {
	const tempMessageId = generateTempId();
	const messageType = messagePayload.messageType;

	// Function to generate text message
	const createTextMessage = () => {
		if (messageType === MessageType.text) {
			return {
				id: generateTempId(),
				messageId: tempMessageId,
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
				messageId: tempMessageId,
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
				messageId: tempMessageId,
				mediaId: generateTempId(),
			}));
		}

		return [];
	};

	return {
		id: tempMessageId,
		conversationId,
		conversation: {
			id: conversationId,
			isGroup: false,
			createdBy: sender.id,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		sender,
		senderId: sender.id,
		createdAt: new Date(),
		updatedAt: new Date(),
		type: messageType,
		seenByMembers: [],
		textMessage: createTextMessage(),
		imageMessage: createImageMessage(),
		documentMessage: createDocumentMessage(),
		systemMessage: null,
		reactions: [],
		isStarred: false,
		isDeleted: false,
	};
};

const createMessageReaction = ({
	messageId,
	userId,
	emoji,
	emojiImageUrl,
	reactionType,
}: {
	messageId: string;
	userId: string;
	reactionType: MessageReactionType;
	emoji: string;
	emojiImageUrl: string;
}) => {
	const newMessageReaction: MessageReaction = {
		id: generateTempId(),
		type: reactionType,
		emoji,
		emojiImageUrl,
		messageId,
		userId,
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	return newMessageReaction;
};

const optimisticSendPrivateMessage = async ({
	conversationId,
	sender,
	messagePayload,
	queryClient,
}: {
	conversationId: string;
	sender: UserProfile;
	messagePayload?: MessagePayloadSchemaType;
	queryClient: QueryClient;
}) => {
	await queryClient.cancelQueries({ queryKey: messageKeys.all(conversationId) });
	const messagesData = getInfiniteQueryData<CompleteMessage>({
		keys: messageKeys.all(conversationId),
		queryClient,
	});

	if (!messagePayload) return { messagesData };

	const tempMessage = generateTempMessage({ conversationId, sender, messagePayload });
	prependConversationMessage({ conversationId, message: tempMessage, queryClient });

	return { messagesData };
};

const optimisticUpdatePrivateTextMessage = async ({
	conversationId,
	messageId,
	message,
	queryClient,
}: {
	conversationId: string;
	messageId: string;
	message: string;
	queryClient: QueryClient;
}) => {
	// Cancel ongoing queries related to messages to ensure cache consistency
	await queryClient.cancelQueries({ queryKey: messageKeys.all(conversationId) });

	const messagesData = getInfiniteQueryData<CompleteMessage>({
		keys: messageKeys.all(conversationId),
		queryClient,
	});

	updateTextMessageContent({
		conversationId,
		messageId,
		messageContent: message,
		queryClient,
	});

	return { messagesData };
};

const optimisticCreateMessageReaction = async ({
	conversationId,
	messageId,
	userId,
	reactionType,
	emoji,
	emojiImageUrl,
	queryClient,
}: {
	conversationId: string;
	messageId: string;
	userId: string;
	reactionType: MessageReactionType;
	emoji: string;
	emojiImageUrl: string;
	queryClient: QueryClient;
}) => {
	const newMessageReaction = createMessageReaction({
		messageId,
		userId,
		reactionType,
		emoji,
		emojiImageUrl,
	});

	// Cancel ongoing queries related to messages to ensure cache consistency
	await queryClient.cancelQueries({ queryKey: messageKeys.all(conversationId) });

	const messagesData = getInfiniteQueryData<CompleteMessage>({
		keys: messageKeys.all(conversationId),
		queryClient,
	});

	appendMessageReaction({
		conversationId,
		messageReaction: newMessageReaction,
		queryClient,
	});

	return { messagesData };
};

const optimisticUpdateMessageReaction = async ({
	conversationId,
	messageReaction,
	queryClient,
}: {
	conversationId: string;
	messageReaction?: MessageReaction;
	queryClient: QueryClient;
}) => {
	// Cancel ongoing queries related to messages to ensure cache consistency
	await queryClient.cancelQueries({ queryKey: messageKeys.all(conversationId) });

	const messagesData = getInfiniteQueryData<CompleteMessage>({
		keys: messageKeys.all(conversationId),
		queryClient,
	});

	updateMessageReaction({ conversationId, messageReaction, queryClient });

	return { messagesData };
};

const optimisticDeleteMessageReaction = async ({
	conversationId,
	messageReaction,
	queryClient,
}: {
	conversationId: string;
	messageReaction?: MessageReaction;
	queryClient: QueryClient;
}) => {
	// Cancel ongoing queries related to messages to ensure cache consistency
	await queryClient.cancelQueries({ queryKey: messageKeys.all(conversationId) });

	const messagesData = getInfiniteQueryData<CompleteMessage>({
		keys: messageKeys.all(conversationId),
		queryClient,
	});

	removeMessageReaction({ conversationId, messageReaction, queryClient });

	return { messagesData };
};

const optimisticToggleMessageStarStatus = async ({
	conversationId,
	message,
	queryClient,
}: {
	conversationId: string;
	message?: CompleteMessage;
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

	toggleMessageStarStatus({ conversationId, message, queryClient });
	if (!message?.isStarred) {
		appendStarredMessage({ conversationId, message, queryClient });
	} else {
		removeStarredMessage({ conversationId, message, queryClient });
	}

	return { messagesData, starredMessagesData };
};

const optimisticDeleteMessage = async ({
	conversationId,
	message,
	deleteForEveryone = false,
	queryClient,
}: {
	conversationId: string;
	message?: CompleteMessage;
	deleteForEveryone?: boolean;
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

	deleteMessage({ conversationId, message, deleteForEveryone, queryClient });

	return { messagesData, starredMessagesData };
};

const optimisticPrivateMessageError = async ({
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

const optimisticStarredMessageError = async ({
	conversationId,
	context,
	queryClient,
}: {
	conversationId: string;
	context?: {
		starredMessagesData?: InfiniteData<APIResponse<PaginatedResponse<CompleteMessage>>>;
	};
	queryClient: QueryClient;
}) => {
	if (!context) return;
	queryClient.setQueryData(messageKeys.starred(conversationId), context.starredMessagesData);
};

const refetchOptimisticPrivateMessages = ({
	conversationId,
	queryClient,
}: {
	conversationId: string;
	queryClient: QueryClient;
}) => {
	queryClient.invalidateQueries({ queryKey: messageKeys.all(conversationId) });
	queryClient.invalidateQueries({ queryKey: messageKeys.starred(conversationId) });
};

export {
	optimisticSendPrivateMessage,
	optimisticUpdatePrivateTextMessage,
	optimisticCreateMessageReaction,
	optimisticUpdateMessageReaction,
	optimisticDeleteMessageReaction,
	optimisticToggleMessageStarStatus,
	optimisticDeleteMessage,
	optimisticPrivateMessageError,
	optimisticStarredMessageError,
	refetchOptimisticPrivateMessages,
};
