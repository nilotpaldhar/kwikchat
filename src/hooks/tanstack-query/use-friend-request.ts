import type { FriendRequestWithRequestType } from "@/types";

import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import usePusher from "@/hooks/use-pusher";
import useCurrentUser from "@/hooks/tanstack-query/use-current-user";

import { friendKeys, friendRequestKeys } from "@/constants/tanstack-query";
import { friendRequestEvents } from "@/constants/pusher-events";

import {
	fetchFriendRequests,
	fetchPendingFriendRequestsCount,
	sendFriendRequest,
	removeFriendRequest,
	acceptFriendRequest,
	rejectFriendRequest,
} from "@/services/friend-request";

import {
	optimisticSendRequest,
	optimisticRemoveRequest,
	optimisticRemoveRequestError,
	optimisticAcceptRequest,
	optimisticAcceptRequestError,
	refetchOptimisticRequests,
} from "@/utils/optimistic-updates/friend-request";
import {
	prependFriendRequest,
	removeFriendRequest as removeFriendRequestFromCache,
	prependRecentFriendRequest,
	removeRecentFriendRequest,
	syncFriendRequestCount,
} from "@/utils/tanstack-query-cache/friend-request";

import generateFriendRequestChannel, {
	type FriendRequestStatus,
	type FriendRequestChannelType,
} from "@/utils/pusher/generate-friend-request-channel";

/**
 * Helper function to generate a Pusher channel name for friend request lifecycle events.
 */
const createFriendRequestChannelName = ({
	channelType,
	status,
	currentUserId,
}: {
	channelType: FriendRequestChannelType;
	status: FriendRequestStatus;
	currentUserId?: string;
}) => {
	// Return undefined if the user is not authenticated
	if (!currentUserId) return undefined;

	// Generate the channel name based on the user ID and event type
	return generateFriendRequestChannel({ receiverId: currentUserId, status, channelType });
};

/**
 * Custom hook to fetch a paginated list of friend requests.
 *
 * Uses react-query's `useInfiniteQuery` to handle pagination and
 * infinite scrolling for the friend requests list.
 */
const useFriendRequestsQuery = (searchQuery?: string) => {
	const queryClient = useQueryClient();

	const { data } = useCurrentUser();
	const currentUserId = data?.data?.id;

	const query = useInfiniteQuery({
		queryKey: friendRequestKeys.search(searchQuery || ""),
		queryFn: ({ pageParam }) => fetchFriendRequests({ page: pageParam, query: searchQuery }),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => lastPage.data?.pagination.nextPage,
	});

	// Set up Pusher listeners for real-time friend request events
	usePusher<FriendRequestWithRequestType>(
		createFriendRequestChannelName({ channelType: "default", status: "incoming", currentUserId }),
		friendRequestEvents.incoming,
		(friendRequest) => prependFriendRequest({ friendRequest, queryClient })
	);
	usePusher<FriendRequestWithRequestType>(
		createFriendRequestChannelName({ channelType: "default", status: "accepted", currentUserId }),
		friendRequestEvents.accept,
		(friendRequest) => removeFriendRequestFromCache({ friendReqId: friendRequest?.id, queryClient })
	);
	usePusher<string>(
		createFriendRequestChannelName({ channelType: "default", status: "deleted", currentUserId }),
		friendRequestEvents.delete,
		(friendReqId) => removeFriendRequestFromCache({ friendReqId, queryClient })
	);
	usePusher<string>(
		createFriendRequestChannelName({ channelType: "default", status: "rejected", currentUserId }),
		friendRequestEvents.reject,
		(friendReqId) => removeFriendRequestFromCache({ friendReqId, queryClient })
	);

	return query;
};

/**
 * Custom hook to fetch the most recent friend requests.
 *
 * Uses react-query's `useQuery` to get the latest friend requests with a single fetch.
 */
const useRecentFriendRequestsQuery = () => {
	const queryClient = useQueryClient();

	const { data } = useCurrentUser();
	const currentUserId = data?.data?.id;

	const query = useQuery({
		queryKey: friendRequestKeys.recent(),
		queryFn: () => fetchFriendRequests({ page: 1 }),
	});

	// Set up Pusher listeners for real-time updates
	usePusher<FriendRequestWithRequestType>(
		createFriendRequestChannelName({ channelType: "recent", status: "incoming", currentUserId }),
		friendRequestEvents.incoming,
		(friendRequest) => prependRecentFriendRequest({ friendRequest, queryClient })
	);
	usePusher<FriendRequestWithRequestType>(
		createFriendRequestChannelName({ channelType: "recent", status: "accepted", currentUserId }),
		friendRequestEvents.accept,
		(friendRequest) => removeRecentFriendRequest({ friendReqId: friendRequest?.id, queryClient })
	);
	usePusher<string>(
		createFriendRequestChannelName({ channelType: "recent", status: "deleted", currentUserId }),
		friendRequestEvents.delete,
		(friendReqId) => removeRecentFriendRequest({ friendReqId, queryClient })
	);
	usePusher<string>(
		createFriendRequestChannelName({ channelType: "recent", status: "rejected", currentUserId }),
		friendRequestEvents.reject,
		(friendReqId) => removeRecentFriendRequest({ friendReqId, queryClient })
	);

	return query;
};

/**
 * Custom hook to fetch the count of pending friend requests.
 *
 * Uses react-query's `useQuery` to retrieve the total count of pending friend requests.
 */
const usePendingFriendRequestsCountQuery = () => {
	const queryClient = useQueryClient();

	const { data } = useCurrentUser();
	const currentUserId = data?.data?.id;

	const query = useQuery({
		queryKey: friendRequestKeys.pendingCount(),
		queryFn: () => fetchPendingFriendRequestsCount(),
	});

	const handleSyncRequestCount = useCallback(() => {
		syncFriendRequestCount({ queryClient });
	}, [queryClient]);

	// Set up Pusher listeners for real-time updates on request count
	usePusher<FriendRequestWithRequestType>(
		createFriendRequestChannelName({ channelType: "count", status: "incoming", currentUserId }),
		friendRequestEvents.incoming,
		handleSyncRequestCount
	);
	usePusher<FriendRequestWithRequestType>(
		createFriendRequestChannelName({ channelType: "count", status: "accepted", currentUserId }),
		friendRequestEvents.accept,
		() => {
			queryClient.invalidateQueries({ queryKey: friendKeys.all });
			handleSyncRequestCount();
		}
	);
	usePusher<string>(
		createFriendRequestChannelName({ channelType: "count", status: "deleted", currentUserId }),
		friendRequestEvents.delete,
		handleSyncRequestCount
	);
	usePusher<string>(
		createFriendRequestChannelName({ channelType: "count", status: "rejected", currentUserId }),
		friendRequestEvents.reject,
		handleSyncRequestCount
	);

	return query;
};

/**
 * Custom hook to send a friend request.
 *
 * Uses react-query's `useMutation` for sending a new friend request, with
 * optimistic updates to provide a seamless user experience by updating the UI
 * before the server response is received.
 */
const useSendFriendRequest = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: sendFriendRequest,

		// On success, optimistically update the query cache with the new request data
		onSuccess: (newRequestResponse) => {
			optimisticSendRequest({ friendRequest: newRequestResponse.data, queryClient });
		},
	});
};

/**
 * Custom hook to remove a friend request.
 *
 * Uses react-query's `useMutation` for removing a friend request, with optimistic updates.
 * In case of an error, the UI is reverted to the previous state.
 */
const useRemoveFriendRequest = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: removeFriendRequest,
		// Optimistically remove the friend request from the query cache
		onMutate: (friendReqId) => optimisticRemoveRequest({ friendReqId, queryClient }),

		// Rollback if an error occurs during the removal
		onError: (_error, _friendReqId, context) =>
			optimisticRemoveRequestError({ queryClient, context }),

		// Refetch the friend requests once the mutation is settled
		onSettled: () => refetchOptimisticRequests({ queryClient }),
	});
};

/**
 * Custom hook to accept a friend request.
 *
 * Uses react-query's `useMutation` for accepting a friend request, with optimistic updates.
 * If an error occurs, the UI is reverted to the previous state.
 */
const useAcceptFriendRequest = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: acceptFriendRequest,

		// Optimistically accept the friend request in the query cache
		onMutate: (friendRequest) => optimisticAcceptRequest({ friendRequest, queryClient }),

		// Rollback if an error occurs during the acceptance
		onError: (_error, _friendRequest, context) =>
			optimisticAcceptRequestError({ queryClient, context }),

		// Refetch the friend requests once the mutation is settled
		onSettled: () => refetchOptimisticRequests({ queryClient }),
	});
};

/**
 * Custom hook to reject a friend request.
 *
 * Uses react-query's `useMutation` for rejecting a friend request, with optimistic updates.
 * If an error occurs, the UI is reverted to the previous state.
 */
const useRejectFriendRequest = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: rejectFriendRequest,

		// Optimistically remove the rejected friend request from the query cache
		onMutate: (friendReqId) => optimisticRemoveRequest({ friendReqId, queryClient }),

		// Rollback if an error occurs during the rejection
		onError: (_error, _friendReqId, context) =>
			optimisticRemoveRequestError({ queryClient, context }),

		// Refetch the friend requests once the mutation is settled
		onSettled: () => refetchOptimisticRequests({ queryClient }),
	});
};

export {
	useFriendRequestsQuery,
	useRecentFriendRequestsQuery,
	usePendingFriendRequestsCountQuery,
	useSendFriendRequest,
	useRemoveFriendRequest,
	useAcceptFriendRequest,
	useRejectFriendRequest,
};
