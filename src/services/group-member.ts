import "client-only";

import type { APIResponse, GroupMember, PaginatedResponse } from "@/types";
import type { MemberRole } from "@prisma/client";

import axios, { handleAxiosError } from "@/lib/axios";

/**
 * Fetches a paginated list of group members for a given conversation.
 */
const fetchGroupMembers = async ({
	conversationId,
	page,
}: {
	conversationId: string;
	page: number;
}) => {
	try {
		// Construct query parameters for pagination.
		const params = new URLSearchParams();
		params.append("page", `${page}`);

		// Build the request URL with the query parameters.
		const url = `/conversations/${conversationId}/group/members?${params.toString()}`;

		// Send a GET request to fetch group members.
		const res = await axios.get<APIResponse<PaginatedResponse<GroupMember>>>(url);
		return res.data;
	} catch (error) {
		const errMsg = handleAxiosError(error);
		throw new Error(errMsg);
	}
};

/**
 * Adds a list of users to a group conversation.
 */
const addGroupMembers = async ({
	conversationId,
	userIdsToAdd,
}: {
	conversationId: string;
	userIdsToAdd: string[];
}) => {
	try {
		const res = await axios.post<APIResponse<undefined>>(
			`/conversations/${conversationId}/group/members`,
			{ userIdsToAdd }
		);
		return res.data;
	} catch (error) {
		const errMsg = handleAxiosError(error);
		throw new Error(errMsg);
	}
};

/**
 * Updates the role of a group member on the server.
 */
const updateGroupMemberRole = async ({
	conversationId,
	memberId,
	memberRole,
}: {
	conversationId: string;
	memberId: string;
	memberRole: MemberRole;
}) => {
	try {
		const res = await axios.patch<APIResponse<GroupMember>>(
			`/conversations/${conversationId}/group/members/${memberId}`,
			{ memberRole }
		);
		return res.data;
	} catch (error) {
		const errMsg = handleAxiosError(error);
		throw new Error(errMsg);
	}
};

/**
 * Removes a group member on the server.
 */
const removeGroupMember = async ({
	conversationId,
	memberId,
}: {
	conversationId: string;
	memberId: string;
}) => {
	try {
		const res = await axios.delete<APIResponse<undefined>>(
			`/conversations/${conversationId}/group/members/${memberId}`
		);
		return res.data;
	} catch (error) {
		const errMsg = handleAxiosError(error);
		throw new Error(errMsg);
	}
};

export { fetchGroupMembers, addGroupMembers, updateGroupMemberRole, removeGroupMember };
