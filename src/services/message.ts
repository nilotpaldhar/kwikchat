import "client-only";

import type { Message } from "@prisma/client";
import type { APIResponse, CompleteMessage, PaginatedResponse } from "@/types";

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
		const res = await axios.post<APIResponse<Message>>(
			`/conversations/${conversationId}/messages`,
			{ message }
		);
		return res.data;
	} catch (error) {
		const errMsg = handleAxiosError(error);
		throw new Error(errMsg);
	}
};

export { fetchPrivateMessages, sendPrivateMessage };
