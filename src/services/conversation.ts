import "client-only";

import type { APIResponse, UserWithoutPassword } from "@/types";

import axios, { handleAxiosError } from "@/lib/axios";

/**
 * Fetches the participant details for a given conversation.
 */
const fetchParticipantInConversation = async (conversationId: string) => {
	try {
		const res = await axios.get<APIResponse<UserWithoutPassword>>(
			`/conversations/${conversationId}/participant`
		);
		return res.data;
	} catch (error) {
		const errMsg = handleAxiosError(error);
		throw new Error(errMsg);
	}
};

/**
 * Clears all messages in a specified conversation.
 */
const clearConversation = async ({ conversationId }: { conversationId: string }) => {
	try {
		const res = await axios.delete<APIResponse<undefined>>(
			`/conversations/${conversationId}/clear`
		);
		return res.data;
	} catch (error) {
		const errMsg = handleAxiosError(error);
		throw new Error(errMsg);
	}
};

export { fetchParticipantInConversation, clearConversation };
