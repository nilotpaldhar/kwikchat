import "client-only";

import type { APIResponse, CompleteMessage, PaginatedResponse, MessageSeenMembers } from "@/types";
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
 * Sends a private message to a specified conversation.
 */
const sendPrivateMessage = async ({
	conversationId,
	message,
}: {
	conversationId: string;
	message: string;
	senderId: string;
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

export { fetchPrivateMessages, sendPrivateMessage, updatePrivateMessage, updateMessageSeenStatus };
