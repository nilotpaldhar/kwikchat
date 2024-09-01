import {
	useQuery,
	useInfiniteQuery,
	useMutation,
	useQueryClient,
	type QueryClient,
	type InfiniteData,
} from "@tanstack/react-query";

import type { APIResponse, FriendRequestWithRequestType, PaginatedResponse } from "@/types";
import type { PaginationMetadata } from "@/utils/general/calculate-pagination";

import {
	FRIEND_REQUEST_KEY,
	PENDING_FRIEND_REQUEST_COUNT_KEY,
	RECENT_FRIEND_REQUEST_KEY,
} from "@/constants/friend-request";

import {
	fetchFriendRequests,
	fetchPendingFriendRequestsCount,
	sendFriendRequest,
	removeFriendRequest,
	acceptFriendRequest,
	rejectFriendRequest,
} from "@/services/friend-request";

/**
 * Handles the optimistic update of friend request data in the cache.
 * This function updates the cached data to reflect the removal of a friend request,
 * providing an immediate UI update while the mutation is in progress.
 *
 * @param friendReqId - The ID of the friend request being removed.
 * @param queryClient - The instance of QueryClient used to interact with the cache.
 * @returns The previous state of the data before the optimistic update, to be used for rollback if needed.
 */
const handleOptimisticUpdate = async ({
	friendReqId,
	queryClient,
}: {
	friendReqId: string;
	queryClient: QueryClient;
}) => {
	// Cancel any ongoing queries for the friend requests to prevent race conditions.
	await queryClient.cancelQueries({ queryKey: [FRIEND_REQUEST_KEY], exact: true });
	await queryClient.cancelQueries({ queryKey: [RECENT_FRIEND_REQUEST_KEY], exact: true });
	await queryClient.cancelQueries({ queryKey: [PENDING_FRIEND_REQUEST_COUNT_KEY], exact: true });

	// Get the current cached data for friend requests, recent friend requests, and pending request count.
	const friendRequestsData = queryClient.getQueryData<
		InfiniteData<APIResponse<PaginatedResponse<FriendRequestWithRequestType>>>
	>([FRIEND_REQUEST_KEY]);

	const recentFriendRequestData = queryClient.getQueryData<
		APIResponse<PaginatedResponse<FriendRequestWithRequestType>>
	>([RECENT_FRIEND_REQUEST_KEY]);

	const pendingFriendRequestCountData = queryClient.getQueryData<APIResponse<{ pending: number }>>([
		PENDING_FRIEND_REQUEST_COUNT_KEY,
	]);

	// Optimistically update the friend requests data in the cache by removing the friend request with the given ID.
	queryClient.setQueryData<
		InfiniteData<APIResponse<PaginatedResponse<FriendRequestWithRequestType>>>
	>([FRIEND_REQUEST_KEY], (existingData) => {
		if (!existingData) return existingData;

		return {
			...existingData,
			pages: existingData.pages.map((page) => {
				const { data, status, message } = page;
				const pagination = data?.pagination as PaginationMetadata;
				const requests = (data?.items ?? []).filter((request) => request.id !== friendReqId);

				return {
					status,
					message,
					data: {
						pagination: { ...pagination, totalItems: pagination.totalItems - 1 },
						items: requests,
					},
				};
			}),
		};
	});

	// Optimistically update the recent friend requests data in the cache by removing the friend request with the given ID.
	queryClient.setQueryData<APIResponse<PaginatedResponse<FriendRequestWithRequestType>>>(
		[RECENT_FRIEND_REQUEST_KEY],
		(existingData) => {
			if (!existingData) return existingData;

			const { data, status, message } = existingData;
			const pagination = data?.pagination as PaginationMetadata;
			const currentRequests = data?.items ?? [];

			const updatedRequests = currentRequests.filter((req) => req.id !== friendReqId);

			return {
				status,
				message,
				data: {
					pagination: { ...pagination, totalItems: pagination.totalItems - 1 },
					items: updatedRequests,
				},
			};
		}
	);

	// Optimistically update the pending friend request count in the cache by decrementing the count.
	queryClient.setQueryData<APIResponse<{ pending: number }>>(
		[PENDING_FRIEND_REQUEST_COUNT_KEY],
		(existingData) => {
			if (!existingData) return existingData;

			const { data, status, message } = existingData;
			let pendingCount = data?.pending ?? 0;

			// Decrement pending count
			if (pendingCount > 0) pendingCount -= 1;

			return {
				status,
				message,
				data: { pending: pendingCount },
			};
		}
	);

	// Return the previous state of the data so it can be restored if the mutation fails.
	return { recentFriendRequestData, pendingFriendRequestCountData, friendRequestsData };
};

/**
 * Handles the rollback of data in case of an error during an optimistic update.
 * This function restores the previous state of the queries using the data stored in the context.
 *
 * @param context - The context containing the previous state of the queries to be restored.
 * @param queryClient - The instance of QueryClient used to update the cached data.
 */
const handleOptimisticUpdateError = ({
	context,
	queryClient,
}: {
	context?: {
		friendRequestsData?: InfiniteData<APIResponse<PaginatedResponse<FriendRequestWithRequestType>>>;
		recentFriendRequestData?: APIResponse<PaginatedResponse<FriendRequestWithRequestType>>;
		pendingFriendRequestCountData?: APIResponse<{ pending: number }>;
	};
	queryClient: QueryClient;
}) => {
	if (!context) return;

	// Restore the cached data for friend requests to the state before the optimistic update.
	queryClient.setQueryData([FRIEND_REQUEST_KEY], context.friendRequestsData);

	// Restore the cached data for recent friend requests to the state before the optimistic update.
	queryClient.setQueryData([RECENT_FRIEND_REQUEST_KEY], context.recentFriendRequestData);

	// Restore the cached data for the pending friend request count to the state before the optimistic update.
	queryClient.setQueryData(
		[PENDING_FRIEND_REQUEST_COUNT_KEY],
		context.pendingFriendRequestCountData
	);
};

/**
 * Invalidates specific queries related to friend requests to refetch updated data.
 * This is typically used after an optimistic update to ensure the data is consistent with the server.
 *
 * @param queryClient - The instance of QueryClient to interact with the cache and trigger refetches.
 */
const handleRefetchOptimisticQueries = ({ queryClient }: { queryClient: QueryClient }) => {
	// Invalidate the query that fetches all friend requests to ensure consistency with the server.
	queryClient.invalidateQueries({ queryKey: [FRIEND_REQUEST_KEY] });

	// Invalidate the query that fetches recent friend requests to refetch the most up-to-date data.
	queryClient.invalidateQueries({ queryKey: [RECENT_FRIEND_REQUEST_KEY] });

	// Invalidate the query that fetches the count of pending friend requests to update the count.
	queryClient.invalidateQueries({ queryKey: [PENDING_FRIEND_REQUEST_COUNT_KEY] });
};

/**
 * Custom hook to fetch a paginated list of friend requests using react-query's useInfiniteQuery hook.
 */
const useFriendRequestsQuery = () => {
	const query = useInfiniteQuery({
		queryKey: [FRIEND_REQUEST_KEY],
		queryFn: ({ pageParam }) => fetchFriendRequests({ page: pageParam }),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => lastPage.data?.pagination.nextPage,
	});

	return query;
};

/**
 * Custom hook to fetch the most recent friend requests using react-query's useQuery hook.
 */
const useRecentFriendRequestsQuery = () => {
	const query = useQuery({
		queryKey: [RECENT_FRIEND_REQUEST_KEY],
		queryFn: () => fetchFriendRequests({ page: 1, limit: 5 }),
	});

	return query;
};

/**
 * Custom hook to fetch the total count of pending friend requests using react-query's useQuery hook.
 */
const usePendingFriendRequestsCountQuery = () => {
	const query = useQuery({
		queryKey: [PENDING_FRIEND_REQUEST_COUNT_KEY],
		queryFn: () => fetchPendingFriendRequestsCount(),
	});

	return query;
};

/**
 * Custom hook to manage sending a friend request using react-query's useMutation hook.
 */
const useSendFriendRequest = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: sendFriendRequest,
		onSuccess: (newRequestResponse) => {
			// Update the friend requests list in the cache
			queryClient.setQueryData<
				InfiniteData<APIResponse<PaginatedResponse<FriendRequestWithRequestType>>>
			>([FRIEND_REQUEST_KEY], (existingData) => {
				if (!existingData) return existingData;

				return {
					...existingData,
					pages: existingData.pages.map((page, index) => {
						if (index !== 0) return page;

						const { data, status, message } = page;
						const pagination = data?.pagination as PaginationMetadata;
						const newRequest = newRequestResponse.data;
						const currentRequests = data?.items ?? [];

						// If there is a new request, prepend it to the existing requests
						const updatedRequests = newRequest ? [newRequest, ...currentRequests] : currentRequests;

						return {
							status,
							message,
							data: {
								// Update pagination with the new total item count
								pagination: { ...pagination, totalItems: pagination.totalItems + 1 },
								items: updatedRequests,
							},
						};
					}),
				};
			});

			// Update the recent friend requests list in the cache
			queryClient.setQueryData<APIResponse<PaginatedResponse<FriendRequestWithRequestType>>>(
				[RECENT_FRIEND_REQUEST_KEY],
				(existingData) => {
					if (!existingData) return existingData;

					const { data, status, message } = existingData;
					const pagination = data?.pagination as PaginationMetadata;
					const newRequest = newRequestResponse.data;
					const currentRequests = data?.items ?? [];

					// If there is a new request, prepend it to the existing requests and
					// Remove the last request if updated requests is more than 5
					const updatedRequests = newRequest ? [newRequest, ...currentRequests] : currentRequests;
					if (updatedRequests.length > 5) updatedRequests.pop();

					return {
						status,
						message,
						data: {
							// Update pagination with the new total item count
							pagination: { ...pagination, totalItems: pagination.totalItems + 1 },
							items: updatedRequests,
						},
					};
				}
			);

			// Update the pending friend request count in the cache
			queryClient.setQueryData<APIResponse<{ pending: number }>>(
				[PENDING_FRIEND_REQUEST_COUNT_KEY],
				(existingData) => {
					if (!existingData) return existingData;

					const { data, status, message } = existingData;
					let pendingCount = data?.pending ?? 0;
					const newRequest = newRequestResponse.data;

					// Increment pending count if the new request is valid
					if (newRequest) pendingCount += 1;

					return {
						status,
						message,
						data: { pending: pendingCount },
					};
				}
			);
		},
	});
};

/**
 * Custom hook to remove friend request using react-query's useMutation hook.
 */
const useRemoveFriendRequest = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: removeFriendRequest,
		onMutate: (friendReqId) => handleOptimisticUpdate({ friendReqId, queryClient }),
		onError: (_error, _friendReqId, context) =>
			handleOptimisticUpdateError({ queryClient, context }),
		onSettled: () => handleRefetchOptimisticQueries({ queryClient }),
	});
};

/**
 * Custom hook to accept friend request using react-query's useMutation hook.
 */
const useAcceptFriendRequest = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: acceptFriendRequest,
		onMutate: (friendReqId) => handleOptimisticUpdate({ friendReqId, queryClient }),
		onError: (_error, _friendReqId, context) =>
			handleOptimisticUpdateError({ queryClient, context }),
		onSettled: () => handleRefetchOptimisticQueries({ queryClient }),
	});
};

/**
 * Custom hook to reject friend request using react-query's useMutation hook.
 */
const useRejectFriendRequest = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: rejectFriendRequest,
		onMutate: (friendReqId) => handleOptimisticUpdate({ friendReqId, queryClient }),
		onError: (_error, _friendReqId, context) =>
			handleOptimisticUpdateError({ queryClient, context }),
		onSettled: () => handleRefetchOptimisticQueries({ queryClient }),
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
