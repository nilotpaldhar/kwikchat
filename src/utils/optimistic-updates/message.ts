import "client-only";

import type { MessageReaction, MessageReactionType } from "@prisma/client";
import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type { APIResponse, CompleteMessage, PaginatedResponse } from "@/types";

import { nanoid } from "nanoid";

import { messageKeys } from "@/constants/tanstack-query";

import {
	prependConversationMessage,
	updateTextMessageContent,
	appendMessageReaction,
	updateMessageReaction,
	removeMessageReaction,
} from "@/utils/tanstack-query-cache/message";

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
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		imageMessage: null,
		reactions: [],
	};

	return newMessage;
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
		id: nanoid(),
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
	optimisticPrivateMessageError,
	refetchOptimisticPrivateMessages,
	optimisticUpdatePrivateTextMessage,
	optimisticCreateMessageReaction,
	optimisticUpdateMessageReaction,
	optimisticDeleteMessageReaction,
};
