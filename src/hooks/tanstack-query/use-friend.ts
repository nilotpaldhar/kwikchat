import type { FriendsFilterType } from "@/types";

import { toast } from "sonner";

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import usePusher from "@/hooks/use-pusher";
import useCurrentUser from "@/hooks/tanstack-query/use-current-user";

import { friendKeys, ONLINE_FRIENDS_REFETCH_INTERVAL } from "@/constants/tanstack-query";
import { friendEvents } from "@/constants/pusher-events";

import { fetchFriends, fetchFriendDetails, removeFriend } from "@/services/friendship";

import {
	optimisticUnfriend,
	optimisticUnfriendError,
	refetchOptimisticFriends,
} from "@/utils/optimistic-updates/friend";
import {
	prependOnlineFriend,
	prependFilteredOnlineFriend,
	removeFromFriendsList,
	removeFromFilteredFriendsList,
} from "@/utils/tanstack-query-cache/friend";

import generateFriendChannel, {
	type FriendChannelType,
} from "@/utils/pusher/generate-friend-channel";

/**
 * Helper function to generate a Pusher channel name for friend related events.
 */
const createFriendChannelName = ({
	uid,
	channelType,
}: {
	uid?: string;
	channelType: FriendChannelType;
}) => {
	if (!uid) return undefined;
	return generateFriendChannel({ uid, channelType });
};

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
	const friendChannel = createFriendChannelName({ uid: data?.data?.id, channelType: "default" });

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

	// Handle when a friend is removed
	const handleFriendRemove = (friendId?: string, onlyOnline: boolean = false) => {
		removeFromFriendsList({ friendId, onlyOnline, queryClient });
		removeFromFilteredFriendsList({ friendId, onlyOnline, queryClient });
	};

	// Subscribe to relevant Pusher events
	usePusher<string>(friendChannel, friendEvents.online, (friendId?: string) => {
		if (!friendId) return;
		fetchFriendDetails(friendId).then((res) =>
			prependOnlineFriend({ friend: res.data, queryClient })
		);
	});
	usePusher<string>(friendChannel, friendEvents.offline, (friendId) =>
		handleFriendRemove(friendId, true)
	);
	usePusher<string>(friendChannel, friendEvents.delete, handleFriendRemove);
	usePusher<string>(friendChannel, friendEvents.block, handleFriendRemove);

	return query;
};

/**
 * Custom hook to fetch friends based on a filter.
 */
const useFilteredFriends = ({ filter = "all" }: { filter?: FriendsFilterType }) => {
	const queryClient = useQueryClient();

	const { data } = useCurrentUser();
	const friendChannel = createFriendChannelName({
		uid: data?.data?.id,
		channelType: "filtered_friends",
	});

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

	// Handle when a friend is removed
	const handleFriendRemove = (friendId?: string, onlyOnline: boolean = false) => {
		removeFromFilteredFriendsList({ friendId, onlyOnline, queryClient });
		removeFromFriendsList({ friendId, onlyOnline, queryClient });
	};

	// Subscribe to relevant Pusher events
	usePusher<string>(friendChannel, friendEvents.online, (friendId?: string) => {
		if (!friendId) return;
		fetchFriendDetails(friendId).then((res) =>
			prependFilteredOnlineFriend({ friend: res.data, queryClient })
		);
	});
	usePusher<string>(friendChannel, friendEvents.offline, (friendId) =>
		handleFriendRemove(friendId, true)
	);
	usePusher<string>(friendChannel, friendEvents.delete, handleFriendRemove);
	usePusher<string>(friendChannel, friendEvents.block, handleFriendRemove);

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
		onError: (error, _blockedUserId, context) => {
			optimisticUnfriendError({ queryClient, context });
			toast.error(error.message);
		},

		// Refetch the friends list once the unfriend operation is settled
		onSettled: () => refetchOptimisticFriends({ queryClient }),

		onSuccess: (_data, { username }) => {
			toast.success(
				`You have successfully removed "${username ?? "unknown"}" from your friends list. You will no longer be able to interact with each other.`
			);
		},
	});
};

export { useFriendsQuery, useFilteredFriends, useUnfriend };
