import type { FriendRequestWithRequestType, FriendsFilterType } from "@/types";

import { useCallback } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import usePusher from "@/hooks/use-pusher";
import useCurrentUser from "@/hooks/tanstack-query/use-current-user";

import { friendKeys, ONLINE_FRIENDS_REFETCH_INTERVAL } from "@/constants/tanstack-query";
import { friendEvents, friendRequestEvents } from "@/constants/pusher-events";

import { fetchFriends, fetchFriendDetails, removeFriend } from "@/services/friendship";

import {
	optimisticUnfriend,
	optimisticUnfriendError,
	refetchOptimisticFriends,
} from "@/utils/optimistic-updates/friend";
import {
	prependAllFriend,
	prependOnlineFriend,
	prependFilteredFriend,
	prependFilteredOnlineFriend,
	removeFromFriendsList,
	removeFromFilteredFriendsList,
} from "@/utils/tanstack-query-cache/friend";

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
	const queryClient = useQueryClient();
	const { data } = useCurrentUser();

	// Set the query key based on search and online filters
	const queryKey = isOnline
		? friendKeys.searchOnline(searchQuery)
		: friendKeys.searchAll(searchQuery);

	const query = useInfiniteQuery({
		queryKey,
		queryFn: ({ pageParam }) => fetchFriends({ page: pageParam, query: searchQuery, isOnline }),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => lastPage.data?.pagination.nextPage,
		staleTime: isOnline ? 0 : Infinity,
		refetchInterval: isOnline ? ONLINE_FRIENDS_REFETCH_INTERVAL : false,
	});

	// Handle when a friend comes online
	const handleFriendOnline = useCallback(
		(friendId?: string) => {
			if (!friendId) return;
			fetchFriendDetails(friendId).then((res) =>
				prependOnlineFriend({ friend: res.data, queryClient })
			);
		},
		[queryClient]
	);

	// Handle when a friend request is accepted
	const handleRequestAccept = useCallback(
		(friendRequest?: FriendRequestWithRequestType) => {
			if (!friendRequest || !friendRequest.receiverId) return;
			fetchFriendDetails(friendRequest.receiverId).then((res) =>
				prependAllFriend({ friend: res.data, queryClient })
			);
		},
		[queryClient]
	);

	// Handle when a friend is removed
	const handleFriendRemove = useCallback(
		(friendId?: string, onlyOnline: boolean = false) => {
			removeFromFriendsList({ friendId, queryClient, onlyOnline });
		},
		[queryClient]
	);

	// Subscribe to relevant Pusher events
	usePusher<string>(data?.data?.id, friendEvents.online, handleFriendOnline);
	usePusher<FriendRequestWithRequestType>(
		data?.data?.id,
		friendRequestEvents.accept,
		handleRequestAccept
	);
	usePusher<string>(data?.data?.id, friendEvents.offline, (friendId) =>
		handleFriendRemove(friendId, true)
	);
	usePusher<string>(data?.data?.id, friendEvents.delete, handleFriendRemove);
	usePusher<string>(data?.data?.id, friendEvents.block, handleFriendRemove);

	return query;
};

/**
 * Custom hook to fetch friends based on a filter.
 */
const useFilteredFriends = ({ filter = "all" }: { filter?: FriendsFilterType }) => {
	const queryClient = useQueryClient();
	const { data } = useCurrentUser();

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
		staleTime: filter === "online" ? 0 : Infinity,
		refetchInterval: filter === "online" ? ONLINE_FRIENDS_REFETCH_INTERVAL : false,
	});

	// Handle when a filtered friend comes online
	const handleFriendOnline = useCallback(
		(friendId?: string) => {
			if (!friendId) return;
			fetchFriendDetails(friendId).then((res) =>
				prependFilteredOnlineFriend({ friend: res.data, queryClient })
			);
		},
		[queryClient]
	);

	// Handle when a filtered friend request is accepted
	const handleRequestAccept = useCallback(
		(friendRequest?: FriendRequestWithRequestType) => {
			if (!friendRequest || !friendRequest.receiverId) return;
			fetchFriendDetails(friendRequest.receiverId).then((res) =>
				prependFilteredFriend({ friend: res.data, queryClient })
			);
		},
		[queryClient]
	);

	// Handle when a filtered friend is removed
	const handleFriendRemove = useCallback(
		(friendId?: string, onlyOnline: boolean = false) => {
			removeFromFilteredFriendsList({ friendId, queryClient, onlyOnline });
		},
		[queryClient]
	);

	// Subscribe to relevant Pusher events
	usePusher<string>(data?.data?.id, friendEvents.online, handleFriendOnline);
	usePusher<FriendRequestWithRequestType>(
		data?.data?.id,
		friendRequestEvents.accept,
		handleRequestAccept
	);
	usePusher<string>(data?.data?.id, friendEvents.offline, (friendId) =>
		handleFriendRemove(friendId, true)
	);
	usePusher<string>(data?.data?.id, friendEvents.delete, handleFriendRemove);
	usePusher<string>(data?.data?.id, friendEvents.block, handleFriendRemove);

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
