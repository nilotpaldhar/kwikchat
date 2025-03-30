import "client-only";

import type { FileType, Media } from "@prisma/client";
import type { APIResponse, PaginatedResponse } from "@/types";

import axios, { handleAxiosError } from "@/lib/axios";

/**
 * Fetches media attachments for a specific conversation from the server.
 */
const fetchConversationMediaAttachments = async ({
	conversationId,
	page,
	mediaType = null,
}: {
	conversationId: string;
	page: number;
	mediaType: FileType | null;
}) => {
	// Construct query parameters for pagination.
	const params = new URLSearchParams();
	params.append("page", `${page}`);
	if (mediaType) params.append("media_type", `${mediaType}`);

	// Build the request URL with the query parameters.
	const url = `/conversations/${conversationId}/attachments?${params.toString()}`;

	try {
		const res = await axios.get<APIResponse<PaginatedResponse<Media>>>(url);
		return res.data;
	} catch (error) {
		const errMsg = handleAxiosError(error);
		throw new Error(errMsg);
	}
};

/**
 * Fetches media attachments from a specific message within a conversation.
 */
const fetchMessageMediaAttachments = async ({
	conversationId,
	messageId,
}: {
	conversationId: string;
	messageId: string;
}) => {
	try {
		const res = await axios.get<APIResponse<Media[]>>(
			`/conversations/${conversationId}/messages/${messageId}/attachments`
		);
		return res.data;
	} catch (error) {
		const errMsg = handleAxiosError(error);
		throw new Error(errMsg);
	}
};

export { fetchConversationMediaAttachments, fetchMessageMediaAttachments };
