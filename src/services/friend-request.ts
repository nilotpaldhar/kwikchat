import "client-only";

import type { APIResponse, PaginatedResponse, FriendRequestWithRequestType } from "@/types";

import axios, { handleAxiosError } from "@/lib/axios";

/**
 * Fetches a paginated list of friend requests.
 */
const fetchFriendRequests = async ({
	page,
	limit,
	query = "",
}: {
	page: number;
	limit?: number;
	query?: string;
}) => {
	try {
		// Construct query parameters for pagination.
		const params = new URLSearchParams();
		params.append("page", `${page}`);
		if (limit) params.append("page_size", `${limit}`);
		if (query) params.append("query", `${query}`);

		// Build the request URL with the query parameters.
		const url = `/friend-requests?${params.toString()}`;

		const res = await axios.get<APIResponse<PaginatedResponse<FriendRequestWithRequestType>>>(url);
		return res.data;
	} catch (error) {
		const errMsg = handleAxiosError(error);
		throw new Error(errMsg);
	}
};

/**
 * Fetches the total count of pending friend requests.
 */
const fetchPendingFriendRequestsCount = async () => {
	try {
		const res = await axios.get<APIResponse<{ pending: number }>>("/friend-requests/pending");
		return res.data;
	} catch (error) {
		const errMsg = handleAxiosError(error);
		throw new Error(errMsg);
	}
};

/**
 * Get the total count of pending friend requests.
 */
const getPendingFriendRequestsCount = async () => {
	try {
		const res = await fetchPendingFriendRequestsCount();
		return res.data?.pending ?? 0;
	} catch (error) {
		return 0;
	}
};

/**
 * Sends a friend request to the specified user.
 */
const sendFriendRequest = async (receiverUsername: string) => {
	try {
		const res = await axios.post<APIResponse<FriendRequestWithRequestType>>("/friend-requests", {
			receiverUsername,
		});
		return res.data;
	} catch (error) {
		const errMsg = handleAxiosError(error);
		throw new Error(errMsg);
	}
};

/**
 * Removes (deletes) a friend request by its ID.
 */
const removeFriendRequest = async (friendReqId: string) => {
	try {
		const res = await axios.delete<APIResponse<undefined>>(`/friend-requests/${friendReqId}`);
		return res.data;
	} catch (error) {
		const errMsg = handleAxiosError(error);
		throw new Error(errMsg);
	}
};

/**
 * Accepts a friend request by its ID.
 */
const acceptFriendRequest = async (friendRequest: FriendRequestWithRequestType) => {
	try {
		const res = await axios.post<APIResponse<FriendRequestWithRequestType>>(
			`/friend-requests/${friendRequest.id}/accept`
		);
		return res.data;
	} catch (error) {
		const errMsg = handleAxiosError(error);
		throw new Error(errMsg);
	}
};

/**
 * Rejects a friend request by its ID.
 */
const rejectFriendRequest = async (friendReqId: string) => {
	try {
		const res = await axios.post<APIResponse<FriendRequestWithRequestType>>(
			`/friend-requests/${friendReqId}/reject`
		);
		return res.data;
	} catch (error) {
		const errMsg = handleAxiosError(error);
		throw new Error(errMsg);
	}
};

export {
	fetchFriendRequests,
	fetchPendingFriendRequestsCount,
	getPendingFriendRequestsCount,
	sendFriendRequest,
	removeFriendRequest,
	acceptFriendRequest,
	rejectFriendRequest,
};
