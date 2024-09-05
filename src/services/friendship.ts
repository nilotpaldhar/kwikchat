import "client-only";

import type { APIResponse, PaginatedResponse, FriendWithFriendship } from "@/types";

import axios, { handleAxiosError } from "@/lib/axios";

/**
 * Fetch a paginated list of friends with optional filters.
 */
const fetchFriends = async ({
	page,
	query = "",
	isOnline = false,
	isRecent = false,
}: {
	page: number;
	query?: string;
	isOnline?: boolean;
	isRecent?: boolean;
}) => {
	try {
		// Construct query parameters for pagination.
		const params = new URLSearchParams();
		params.append("page", `${page}`);
		if (query) params.append("query", `${query}`);
		if (isOnline) params.append("is_online", "true");
		if (isRecent) params.append("is_recent", "true");

		// Build the request URL with the query parameters.
		const url = `/friends?${params.toString()}`;

		const res = await axios.get<APIResponse<PaginatedResponse<FriendWithFriendship>>>(url);
		return res.data;
	} catch (error) {
		const errMsg = handleAxiosError(error);
		throw new Error(errMsg);
	}
};

/**
 * Fetch details of a specific friend by their ID.
 */
const fetchFriendDetails = async (friendId: string) => {
	try {
		const res = await axios.get<APIResponse<FriendWithFriendship>>(`/friends/${friendId}`);
		return res.data;
	} catch (error) {
		const errMsg = handleAxiosError(error);
		throw new Error(errMsg);
	}
};

/**
 * Remove a friend by their ID.
 */
const removeFriend = async (friend: FriendWithFriendship) => {
	try {
		const res = await axios.delete<APIResponse<undefined>>(`/friends/${friend.id}`);
		return res.data;
	} catch (error) {
		const errMsg = handleAxiosError(error);
		throw new Error(errMsg);
	}
};

export { fetchFriends, fetchFriendDetails, removeFriend };
