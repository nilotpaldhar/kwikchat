import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { friendRequestKeys } from "@/constants/tanstack-query";
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

/**
 * Custom hook to fetch a paginated list of friend requests.
 *
 * Uses react-query's `useInfiniteQuery` to handle pagination and
 * infinite scrolling for the friend requests list.
 */
const useFriendRequestsQuery = (searchQuery?: string) => {
	const query = useInfiniteQuery({
		queryKey: friendRequestKeys.search(searchQuery || ""),
		queryFn: ({ pageParam }) => fetchFriendRequests({ page: pageParam, query: searchQuery }),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => lastPage.data?.pagination.nextPage,
	});

	return query;
};

/**
 * Custom hook to fetch the most recent friend requests.
 *
 * Uses react-query's `useQuery` to get the latest friend requests with a single fetch.
 */
const useRecentFriendRequestsQuery = () => {
	const query = useQuery({
		queryKey: friendRequestKeys.recent(),
		queryFn: () => fetchFriendRequests({ page: 1 }),
	});

	return query;
};

/**
 * Custom hook to fetch the count of pending friend requests.
 *
 * Uses react-query's `useQuery` to retrieve the total count of pending friend requests.
 */
const usePendingFriendRequestsCountQuery = () => {
	const query = useQuery({
		queryKey: friendRequestKeys.pendingCount(),
		queryFn: () => fetchPendingFriendRequestsCount(),
	});

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
