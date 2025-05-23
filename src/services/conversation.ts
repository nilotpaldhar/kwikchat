import "client-only";

import type {
	APIResponse,
	UserWithoutPassword,
	GroupOverview,
	GroupMember,
	ConversationWithMetadata,
	PaginatedResponse,
} from "@/types";

import axios, { handleAxiosError } from "@/lib/axios";

/**
 * Fetches conversations with metadata based on the provided parameters.
 */
const fetchConversationsWithMetadata = async ({
	page,
	groupOnly = false,
	includeUnreadOnly = false,
}: {
	page: number;
	groupOnly?: boolean;
	includeUnreadOnly?: boolean;
}) => {
	try {
		// Construct query parameters for pagination.
		const params = new URLSearchParams();
		params.append("page", `${page}`);
		if (groupOnly) params.append("group_only", "true");
		if (includeUnreadOnly) params.append("include_unread_only", "true");

		// Build the request URL with the query parameters.
		const url = `/conversations?${params.toString()}`;

		const res = await axios.get<APIResponse<PaginatedResponse<ConversationWithMetadata>>>(url);
		return res.data;
	} catch (error) {
		const errMsg = handleAxiosError(error);
		throw new Error(errMsg);
	}
};

/**
 * Fetches the details of a specific conversation, including its metadata.
 */
const fetchConversationDetails = async ({ conversationId }: { conversationId: string }) => {
	try {
		const res = await axios.get<APIResponse<ConversationWithMetadata>>(
			`/conversations/${conversationId}`
		);
		return res.data;
	} catch (error) {
		const errMsg = handleAxiosError(error);
		throw new Error(errMsg);
	}
};

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
 * Fetches details for a specified group conversation.
 */
const fetchGroupConversationDetails = async (conversationId: string) => {
	try {
		const res = await axios.get<APIResponse<GroupOverview>>(
			`/conversations/${conversationId}/group`
		);
		return res.data;
	} catch (error) {
		const errMsg = handleAxiosError(error);
		throw new Error(errMsg);
	}
};

/**
 * Function to update group conversation details.
 */
const updateGroupConversationDetails = async ({
	conversationId,
	groupName,
	groupDescription,
	groupBannerColor,
	groupIcon,
}: {
	conversationId: string;
	groupName?: string;
	groupDescription?: string;
	groupBannerColor?: string;
	groupIcon?: string;
}) => {
	try {
		const res = await axios.patch<APIResponse<GroupOverview>>(
			`/conversations/${conversationId}/group`,
			{ groupName, groupDescription, groupBannerColor, groupIcon }
		);
		return res.data;
	} catch (error) {
		const errMsg = handleAxiosError(error);
		throw new Error(errMsg);
	}
};

/**
 * Fetches membership details of the current user in a specific conversation.
 */
const fetchGroupConversationMembership = async (conversationId: string) => {
	try {
		const res = await axios.get<APIResponse<GroupMember>>(
			`/conversations/${conversationId}/group/membership`
		);
		return res.data;
	} catch (error) {
		const errMsg = handleAxiosError(error);
		throw new Error(errMsg);
	}
};

/**
 * Function to clear all messages in a specified conversation.
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

/**
 * Function to delete a group conversation by its ID.
 */
const deleteGroupConversation = async ({ conversationId }: { conversationId: string }) => {
	try {
		const res = await axios.delete<APIResponse<undefined>>(
			`/conversations/${conversationId}/group`
		);
		return res.data;
	} catch (error) {
		const errMsg = handleAxiosError(error);
		throw new Error(errMsg);
	}
};

/**
 * Function to delete a conversation by its ID.
 */
const deleteConversation = async ({ conversationId }: { conversationId: string }) => {
	try {
		const res = await axios.delete<APIResponse<undefined>>(`/conversations/${conversationId}`);
		return res.data;
	} catch (error) {
		const errMsg = handleAxiosError(error);
		throw new Error(errMsg);
	}
};

/**
 * Function to exit a group conversation.
 */
const exitGroupConversation = async ({ conversationId }: { conversationId: string }) => {
	try {
		const res = await axios.delete<APIResponse<undefined>>(
			`/conversations/${conversationId}/group/exit`
		);
		return res.data;
	} catch (error) {
		const errMsg = handleAxiosError(error);
		throw new Error(errMsg);
	}
};

export {
	fetchConversationsWithMetadata,
	fetchConversationDetails,
	fetchParticipantInConversation,
	fetchGroupConversationDetails,
	updateGroupConversationDetails,
	fetchGroupConversationMembership,
	clearConversation,
	deleteGroupConversation,
	deleteConversation,
	exitGroupConversation,
};
