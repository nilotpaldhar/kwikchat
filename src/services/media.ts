import "client-only";

import type { Media } from "@prisma/client";
import type { APIResponse } from "@/types";

import axios, { handleAxiosError } from "@/lib/axios";

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

// eslint-disable-next-line import/prefer-default-export
export { fetchMessageMediaAttachments };
