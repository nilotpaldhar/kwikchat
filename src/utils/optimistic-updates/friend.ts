import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type { APIResponse, PaginatedResponse, FriendWithFriendship } from "@/types";

import { friendKeys } from "@/constants/tanstack-query";
import { getInfiniteQueryData } from "@/utils/tanstack-query-cache/helpers";
import {
	removeFromFriendsList,
	removeFromFilteredFriendsList,
} from "@/utils/tanstack-query-cache/friend";

/**
 * Handles the optimistic update when unfriending a user.
 *
 * This function ensures that the UI is immediately updated to reflect the friend being removed,
 * without waiting for the server response. It temporarily removes the friend from various query caches
 * (all friends, online friends, filtered lists), so the user sees the updated friend list immediately.
 */
const optimisticUnfriend = async ({
	friend,
	queryClient,
}: {
	friend: FriendWithFriendship;
	queryClient: QueryClient;
}) => {
	// Cancel any ongoing queries for friends to avoid potential conflicts during updates
	await queryClient.cancelQueries({ queryKey: friendKeys.searchAll("") });
	await queryClient.cancelQueries({ queryKey: friendKeys.searchOnline("") });
	await queryClient.cancelQueries({ queryKey: friendKeys.filtered("all") });
	await queryClient.cancelQueries({ queryKey: friendKeys.filtered("online") });
	await queryClient.cancelQueries({ queryKey: friendKeys.filtered("new") });

	// Retrieve the current data for all friends, online friends, and new friends
	const friendsData = getInfiniteQueryData<FriendWithFriendship>({
		keys: friendKeys.searchAll(""),
		queryClient,
	});
	const onlineFriendsData = getInfiniteQueryData<FriendWithFriendship>({
		keys: friendKeys.searchOnline(""),
		queryClient,
	});
	const newFriendsData = getInfiniteQueryData<FriendWithFriendship>({
		keys: friendKeys.filtered("new"),
		queryClient,
	});

	// Optimistically remove from the all friends list
	removeFromFriendsList({ friendId: friend.id, queryClient });

	// Optimistically remove from the filtered friends list
	removeFromFilteredFriendsList({ friendId: friend.id, queryClient });

	return { friendsData, onlineFriendsData, newFriendsData };
};

/**
 * Handles the case where an optimistic unfriend operation fails.
 *
 * If an error occurs while unfriending, this function restores the original friend list
 * by resetting the cached data back to its previous state.
 */
const optimisticUnfriendError = ({
	context,
	queryClient,
}: {
	context?: {
		friendsData?: InfiniteData<APIResponse<PaginatedResponse<FriendWithFriendship>>>;
		onlineFriendsData?: InfiniteData<APIResponse<PaginatedResponse<FriendWithFriendship>>>;
		newFriendsData?: InfiniteData<APIResponse<PaginatedResponse<FriendWithFriendship>>>;
	};
	queryClient: QueryClient;
}) => {
	// Restore cached data if it exists in the context
	if (!context) return;

	queryClient.setQueryData(friendKeys.searchAll(""), context.friendsData);
	queryClient.setQueryData(friendKeys.searchOnline(""), context.onlineFriendsData);
	queryClient.setQueryData(friendKeys.filtered("all"), context.friendsData);
	queryClient.setQueryData(friendKeys.filtered("online"), context.onlineFriendsData);
	queryClient.setQueryData(friendKeys.filtered("new"), context.newFriendsData);
};

/**
 * Refetches all friend-related queries to ensure the cache is up-to-date.
 *
 * This function is used after an optimistic update settles to ensure the data is correctly
 * synchronized with the server.
 */
const refetchOptimisticFriends = ({ queryClient }: { queryClient: QueryClient }) => {
	// Invalidate all friend-related queries to refetch from the server
	queryClient.invalidateQueries({ queryKey: friendKeys.all });
};

export { optimisticUnfriend, optimisticUnfriendError, refetchOptimisticFriends };
