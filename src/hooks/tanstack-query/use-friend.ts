import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import type { FriendsFilterType } from "@/types";

import { friendKeys } from "@/constants/tanstack-query";
import { fetchFriends, removeFriend } from "@/services/friendship";
import {
	optimisticUnfriend,
	optimisticUnfriendError,
	refetchOptimisticFriends,
} from "@/utils/optimistic-updates/friend";

/**
 * Custom hook to fetch friends with optional search and online filters.
 */
const useFriendsQuery = ({
	searchQuery = "",
	isOnline = false,
}: {
	searchQuery?: string;
	isOnline?: boolean;
}) => {
	// Set the query key based on search and online filters
	let queryKey: string[] = [...friendKeys.searchAll(searchQuery)];
	if (isOnline) queryKey = [...friendKeys.searchOnline(searchQuery)];

	const query = useInfiniteQuery({
		queryKey,
		queryFn: ({ pageParam }) => fetchFriends({ page: pageParam, query: searchQuery, isOnline }),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => lastPage.data?.pagination.nextPage,
	});

	return query;
};

/**
 * Custom hook to fetch friends based on a filter.
 */
const useFilteredFriends = ({ filter = "all" }: { filter?: FriendsFilterType }) => {
	const query = useInfiniteQuery({
		queryKey: friendKeys.filtered(filter),
		queryFn: ({ pageParam }) =>
			fetchFriends({
				page: pageParam,
				isOnline: filter === "online",
				isRecent: filter === "new",
			}),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => lastPage.data?.pagination.nextPage,
	});

	return query;
};

/**
 * Custom hook to unfriend a user with optimistic updates.
 *
 * Handles unfriend operation using mutation, including optimistic updates
 * and rollback in case of an error.
 */
const useUnfriend = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: removeFriend,

		// Optimistically update the friend list when the unfriend operation starts
		onMutate: (friend) => optimisticUnfriend({ friend, queryClient }),

		// Handle error during unfriending, reverting the optimistic update
		onError: (_error, _blockedUserId, context) => optimisticUnfriendError({ queryClient, context }),

		// Refetch the friends list once the unfriend operation is settled
		onSettled: () => refetchOptimisticFriends({ queryClient }),
	});
};

export { useFriendsQuery, useFilteredFriends, useUnfriend };
