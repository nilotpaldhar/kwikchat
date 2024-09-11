import "client-only";

import type { APIResponse, PaginatedResponse, BlockedUser, FriendWithFriendship } from "@/types";
import axios, { handleAxiosError } from "@/lib/axios";

/**
 * Fetch a paginated list of blocked users.
 */
const fetchBlockedUsers = async ({ page, query = "" }: { page: number; query?: string }) => {
	try {
		// Construct query parameters for pagination.
		const params = new URLSearchParams();
		params.append("page", `${page}`);
		if (query) params.append("query", `${query}`);

		// Build the request URL with the query parameters.
		const url = `/users/blocks?${params.toString()}`;

		const res = await axios.get<APIResponse<PaginatedResponse<BlockedUser>>>(url);
		return res.data;
	} catch (error) {
		const errMsg = handleAxiosError(error);
		throw new Error(errMsg);
	}
};

/**
 * Block a user by their ID.
 */
const blockUser = async (user: FriendWithFriendship) => {
	try {
		const res = await axios.post<APIResponse<BlockedUser>>("/users/blocks", {
			blockedUserId: user.id,
		});
		return res.data;
	} catch (error) {
		const errMsg = handleAxiosError(error);
		throw new Error(errMsg);
	}
};

/**
 * Unblock a user by their ID.
 */
const unblockUser = async (blockedUserId: string) => {
	try {
		const res = await axios.delete<APIResponse<undefined>>("/users/blocks", {
			data: { blockedUserId },
		});
		return res.data;
	} catch (error) {
		const errMsg = handleAxiosError(error);
		throw new Error(errMsg);
	}
};

export { fetchBlockedUsers, blockUser, unblockUser };
