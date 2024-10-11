import "client-only";

import type { MessageReaction, MessageReactionType } from "@prisma/client";
import type {
	APIResponse,
	CompleteMessage,
	PaginatedResponse,
	MessageSeenMembers,
	UserProfile,
} from "@/types";

import axios, { handleAxiosError } from "@/lib/axios";

/**
 * Fetches private messages for a given conversation with pagination support.
 */
const fetchPrivateMessages = async ({
	conversationId,
	page,
}: {
	conversationId: string;
	page: number;
}) => {
	// Construct query parameters for pagination.
	const params = new URLSearchParams();
	params.append("page", `${page}`);

	// Build the request URL with the query parameters.
	const url = `/conversations/${conversationId}/messages?${params.toString()}`;

	try {
		const res = await axios.get<APIResponse<PaginatedResponse<CompleteMessage>>>(url);
		return res.data;
	} catch (error) {
		const errMsg = handleAxiosError(error);
		throw new Error(errMsg);
	}
};

/**
 * Fetches starred messages for a given conversation with pagination support.
 */
const fetchStarredMessages = async ({
	conversationId,
	page,
}: {
	conversationId: string;
	page: number;
}) => {
	// Construct query parameters for pagination.
	const params = new URLSearchParams();
	params.append("page", `${page}`);

	// Build the request URL with the query parameters.
	const url = `/conversations/${conversationId}/starred-messages?${params.toString()}`;

	try {
		const res = await axios.get<APIResponse<PaginatedResponse<CompleteMessage>>>(url);
		return res.data;
	} catch (error) {
		const errMsg = handleAxiosError(error);
		throw new Error(errMsg);
	}
};

/**
 * Sends a private message to a specified conversation.
 */
const sendPrivateMessage = async ({
	conversationId,
	message,
}: {
	conversationId: string;
	message: string;
	sender: UserProfile;
}) => {
	try {
		const res = await axios.post<APIResponse<CompleteMessage>>(
			`/conversations/${conversationId}/messages`,
			{ message }
		);
		return res.data;
	} catch (error) {
		const errMsg = handleAxiosError(error);
		throw new Error(errMsg);
	}
};

/**
 * Update a private message to a specified conversation.
 */
const updatePrivateMessage = async ({
	conversationId,
	messageId,
	message,
}: {
	conversationId: string;
	messageId: string;
	message: string;
}) => {
	try {
		const res = await axios.patch<APIResponse<CompleteMessage>>(
			`/conversations/${conversationId}/messages/${messageId}`,
			{ message }
		);
		return res.data;
	} catch (error) {
		const errMsg = handleAxiosError(error);
		throw new Error(errMsg);
	}
};

/**
 * Updates the seen status of messages in a specific conversation.
 */
const updateMessageSeenStatus = async ({
	conversationId,
	messageIds,
}: {
	conversationId: string;
	messageIds: string[];
}) => {
	try {
		const res = await axios.post<APIResponse<MessageSeenMembers[]>>(
			`/conversations/${conversationId}/messages/seen`,
			{ messageIds }
		);
		return res.data;
	} catch (error) {
		const errMsg = handleAxiosError(error);
		throw new Error(errMsg);
	}
};

/**
 * Creates a new reaction for a message in a conversation.
 */
const createMessageReaction = async ({
	conversationId,
	messageId,
	reactionType,
	emoji,
	emojiImageUrl,
}: {
	conversationId: string;
	messageId: string;
	userId: string;
	reactionType: MessageReactionType;
	emoji: string;
	emojiImageUrl: string;
}) => {
	try {
		const res = await axios.post<APIResponse<MessageReaction>>(
			`/conversations/${conversationId}/messages/${messageId}/reactions`,
			{ reactionType, emoji, emojiImageUrl }
		);
		return res.data;
	} catch (error) {
		const errMsg = handleAxiosError(error);
		throw new Error(errMsg);
	}
};

/**
 * Updates an existing reaction for a message in a conversation.
 */
const updateMessageReaction = async ({
	conversationId,
	messageId,
	data,
}: {
	conversationId: string;
	messageId: string;
	messageReaction: MessageReaction;
	data: {
		reactionType: MessageReactionType;
		emoji: string;
		emojiImageUrl: string;
	};
}) => {
	try {
		const res = await axios.patch<APIResponse<MessageReaction>>(
			`/conversations/${conversationId}/messages/${messageId}/reactions`,
			data
		);
		return res.data;
	} catch (error) {
		const errMsg = handleAxiosError(error);
		throw new Error(errMsg);
	}
};

/**
 * Deletes a reaction from a message in a conversation.
 */
const deleteMessageReaction = async ({
	conversationId,
	messageId,
}: {
	conversationId: string;
	messageId: string;
	messageReaction: MessageReaction;
}) => {
	try {
		const res = await axios.delete<APIResponse<undefined>>(
			`/conversations/${conversationId}/messages/${messageId}/reactions`
		);
		return res.data;
	} catch (error) {
		const errMsg = handleAxiosError(error);
		throw new Error(errMsg);
	}
};

/**
 * Toggles the star status of a message in a conversation.
 */
const toggleMessageStarStatus = async ({
	conversationId,
	message,
}: {
	conversationId: string;
	message: CompleteMessage;
}) => {
	try {
		if (message.isStarred) {
			const res = await axios.delete<APIResponse<CompleteMessage>>(
				`/conversations/${conversationId}/messages/${message.id}/star`
			);
			return res.data;
		}

		const res = await axios.post<APIResponse<undefined>>(
			`/conversations/${conversationId}/messages/${message.id}/star`
		);
		return res.data;
	} catch (error) {
		const errMsg = handleAxiosError(error);
		throw new Error(errMsg);
	}
};

export {
	fetchPrivateMessages,
	fetchStarredMessages,
	sendPrivateMessage,
	updatePrivateMessage,
	updateMessageSeenStatus,
	createMessageReaction,
	updateMessageReaction,
	deleteMessageReaction,
	toggleMessageStarStatus,
};
