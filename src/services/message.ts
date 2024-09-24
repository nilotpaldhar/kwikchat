import "client-only";

import type { Message } from "@prisma/client";
import type { APIResponse, FullMessage } from "@/types";

import axios, { handleAxiosError } from "@/lib/axios";

const fetchPrivateMessages = async ({ conversationId }: { conversationId: string }) => {
	try {
		const res = await axios.get<APIResponse<FullMessage[]>>(
			`/conversations/${conversationId}/messages`
		);
		return res.data;
	} catch (error) {
		const errMsg = handleAxiosError(error);
		throw new Error(errMsg);
	}
};

const sendPrivateMessage = async ({
	conversationId,
	message,
}: {
	conversationId: string;
	message: string;
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
