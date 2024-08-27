import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { handleAxiosError } from "@/lib/axios";

import type { APIResponse, FriendRequestWithRelations } from "@/types";

// Query key for the friends data. Used to invalidate or refetch queries when necessary.
const FRIENDS_QUERY_KEY = "FRIENDS";

/**
 * Sends a friend request to the specified user.
 */
const sendFriendRequest = async (receiverUsername: string) => {
	try {
		const res = await axios.post<APIResponse<FriendRequestWithRelations>>("/friend-requests", {
			receiverUsername,
		});
		return res.data;
	} catch (error) {
		const errMsg = handleAxiosError(error);
		throw new Error(errMsg);
	}
};

/**
 * Custom hook to manage sending a friend request using react-query's useMutation hook.
 */
const useSendFriendRequest = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: sendFriendRequest,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [FRIENDS_QUERY_KEY] });
		},
	});
};

// eslint-disable-next-line import/prefer-default-export
export { useSendFriendRequest };
