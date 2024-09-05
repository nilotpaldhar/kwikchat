import { nanoid } from "nanoid";

import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type {
	APIResponse,
	FriendRequestWithRequestType,
	FriendWithFriendship,
	PaginatedResponse,
} from "@/types";

import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";
import { friendKeys, friendRequestKeys } from "@/constants/tanstack-query";
import {
	getQueryData,
	getInfiniteQueryData,
	updatePaginatedData,
	updateInfinitePaginatedData,
} from "@/utils/optimistic-updates/helpers";

/**
 * Adds a new friend to the list of friends.
 *
 * This function creates a new `FriendWithFriendship` object from a `FriendRequestWithRequestType`
 * and adds it to the current list of friends.
 */
const addFriendToList = ({
	friendRequest,
	currentFriends,
}: {
	friendRequest: FriendRequestWithRequestType;
	currentFriends?: FriendWithFriendship[] | null;
}) => {
	const { receiverId, senderId, sender } = friendRequest;
	const newFriend: FriendWithFriendship | undefined = sender
		? {
				...sender,
				friendship: {
					id: nanoid(),
					createdAt: new Date(),
					friendId: senderId,
					userId: receiverId,
				},
			}
		: undefined;

	// Add the new friend to the beginning of the list if valid, otherwise return the current list
	return newFriend ? [newFriend, ...(currentFriends ?? [])] : [...(currentFriends ?? [])];
};

/**
 * Optimistically updates the cache when a friend request is sent.
 *
 * This function temporarily updates the UI to reflect that a friend request has been sent,
 * adding it to the appropriate lists in the cache.
 */
const optimisticSendRequest = async ({
	friendRequest,
	queryClient,
}: {
	friendRequest?: FriendRequestWithRequestType;
	queryClient: QueryClient;
}) => {
	// Update the list of friend requests in the cache
	queryClient.setQueryData<
		InfiniteData<APIResponse<PaginatedResponse<FriendRequestWithRequestType>>>
	>(friendRequestKeys.search(""), (existingData) =>
		updateInfinitePaginatedData<FriendRequestWithRequestType>({
			existingData,
			updateFn: (data, pagination) => ({
				pagination: { ...pagination, totalItems: pagination.totalItems + 1 },
				items: friendRequest ? [friendRequest, ...(data?.items ?? [])] : [...(data?.items ?? [])],
			}),
		})
	);

	// Update the recent friend requests list in the cache
	queryClient.setQueryData<APIResponse<PaginatedResponse<FriendRequestWithRequestType>>>(
		friendRequestKeys.recent(),
		(existingData) =>
			updatePaginatedData<FriendRequestWithRequestType>({
				existingData,
				updateFn: (data, pagination) => {
					const currentRequests = data?.items ?? [];
					const updatedRequests = friendRequest
						? [friendRequest, ...currentRequests]
						: currentRequests;
					if (updatedRequests.length > DEFAULT_PAGE_SIZE) updatedRequests.pop();

					return {
						pagination: { ...pagination, totalItems: pagination.totalItems + 1 },
						items: updatedRequests,
					};
				},
			})
	);

	// Update the count of pending friend requests in the cache
	queryClient.setQueryData<APIResponse<{ pending: number }>>(
		friendRequestKeys.pendingCount(),
		(existingData) => {
			if (!existingData) return existingData;

			const { data, status, message } = existingData;
			let pendingCount = data?.pending ?? 0;
			if (friendRequest) pendingCount += 1;

			return { status, message, data: { pending: pendingCount } };
		}
	);
};

/**
 * Optimistically updates the cache when a friend request is removed.
 *
 * This function temporarily updates the UI to reflect that a friend request has been removed,
 * removing it from the appropriate lists in the cache.
 */
const optimisticRemoveRequest = async ({
	friendReqId,
	queryClient,
}: {
	friendReqId: string;
	queryClient: QueryClient;
}) => {
	// Cancel any ongoing queries for the friend requests to prevent race conditions.
	await queryClient.cancelQueries({ queryKey: friendRequestKeys.search("") });
	await queryClient.cancelQueries({ queryKey: friendRequestKeys.recent() });
	await queryClient.cancelQueries({ queryKey: friendRequestKeys.pendingCount() });

	// Get the current cached data for friend requests, recent friend requests, and pending request count.
	const friendRequestsData = getInfiniteQueryData<FriendRequestWithRequestType>({
		keys: friendRequestKeys.search(""),
		queryClient,
	});
	const recentFriendRequestData = getQueryData<FriendRequestWithRequestType>({
		keys: friendRequestKeys.recent(),
		queryClient,
	});
	const pendingFriendRequestCountData = queryClient.getQueryData<APIResponse<{ pending: number }>>([
		friendRequestKeys.pendingCount(),
	]);

	// Remove the friend request from the all friend request list
	queryClient.setQueryData<
		InfiniteData<APIResponse<PaginatedResponse<FriendRequestWithRequestType>>>
	>(friendRequestKeys.search(""), (existingData) =>
		updateInfinitePaginatedData({
			existingData,
			updateFn: (data, pagination) => ({
				pagination: { ...pagination, totalItems: pagination.totalItems - 1 },
				items: (data?.items ?? []).filter((item) => item.id !== friendReqId),
			}),
		})
	);

	// Remove the friend request from the recent friend request list
	queryClient.setQueryData<APIResponse<PaginatedResponse<FriendRequestWithRequestType>>>(
		friendRequestKeys.recent(),
		(existingData) =>
			updatePaginatedData({
				existingData,
				updateFn: (data, pagination) => ({
					pagination: { ...pagination, totalItems: pagination.totalItems - 1 },
					items: (data?.items ?? []).filter((item) => item.id !== friendReqId),
				}),
			})
	);

	// Decrement the pending friend request count
	queryClient.setQueryData<APIResponse<{ pending: number }>>(
		friendRequestKeys.pendingCount(),
		(existingData) => {
			if (!existingData) return existingData;

			const { data, status, message } = existingData;
			let pendingCount = data?.pending ?? 0;
			if (pendingCount > 0) pendingCount -= 1;

			return { status, message, data: { pending: pendingCount } };
		}
	);

	return { friendRequestsData, recentFriendRequestData, pendingFriendRequestCountData };
};

/**
 * Restores the original data in the cache if an error occurs during optimistic request removal.
 *
 * This function reverts the cache to its state before the optimistic update, ensuring data consistency.
 */
const optimisticRemoveRequestError = async ({
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
	queryClient.setQueryData(friendRequestKeys.search(""), context.friendRequestsData);
	queryClient.setQueryData(friendRequestKeys.recent(), context.recentFriendRequestData);
	queryClient.setQueryData(friendRequestKeys.pendingCount(), context.pendingFriendRequestCountData);
};

/**
 * Optimistically updates the cache when a friend request is accepted.
 *
 * This function temporarily updates the UI to reflect that a friend request has been accepted,
 * adding the friend to the appropriate lists in the cache and removing the request.
 */
const optimisticAcceptRequest = async ({
	friendRequest,
	queryClient,
}: {
	friendRequest: FriendRequestWithRequestType;
	queryClient: QueryClient;
}) => {
	// Cancel ongoing queries related to friends to ensure cache consistency
	await queryClient.cancelQueries({ queryKey: friendKeys.searchAll("") });
	await queryClient.cancelQueries({ queryKey: friendKeys.searchOnline("") });
	await queryClient.cancelQueries({ queryKey: friendKeys.filtered("all") });
	await queryClient.cancelQueries({ queryKey: friendKeys.filtered("online") });
	await queryClient.cancelQueries({ queryKey: friendKeys.filtered("new") });

	// Retrieve the current data from the cache for all friends, online friends, and new friends
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

	// Add the new friend to the lists in the cache
	queryClient.setQueryData<InfiniteData<APIResponse<PaginatedResponse<FriendWithFriendship>>>>(
		friendKeys.searchAll(""),
		(existingData) =>
			updateInfinitePaginatedData<FriendWithFriendship>({
				existingData,
				updateFn: (data, pagination) => ({
					pagination: { ...pagination, totalItems: pagination.totalItems + 1 },
					items: addFriendToList({ friendRequest, currentFriends: data?.items }),
				}),
			})
	);

	// Update filtered lists: all friends and new friends
	queryClient.setQueryData<InfiniteData<APIResponse<PaginatedResponse<FriendWithFriendship>>>>(
		friendKeys.filtered("all"),
		(existingData) =>
			updateInfinitePaginatedData<FriendWithFriendship>({
				existingData,
				updateFn: (data, pagination) => ({
					pagination: { ...pagination, totalItems: pagination.totalItems + 1 },
					items: addFriendToList({ friendRequest, currentFriends: data?.items }),
				}),
			})
	);

	queryClient.setQueryData<InfiniteData<APIResponse<PaginatedResponse<FriendWithFriendship>>>>(
		friendKeys.filtered("new"),
		(existingData) =>
			updateInfinitePaginatedData<FriendWithFriendship>({
				existingData,
				updateFn: (data, pagination) => ({
					pagination: { ...pagination, totalItems: pagination.totalItems + 1 },
					items: addFriendToList({ friendRequest, currentFriends: data?.items }),
				}),
			})
	);

	// If the friend is online, add to the online friends list as well
	if (friendRequest.sender?.isOnline) {
		queryClient.setQueryData<InfiniteData<APIResponse<PaginatedResponse<FriendWithFriendship>>>>(
			friendKeys.searchOnline(""),
			(existingData) =>
				updateInfinitePaginatedData<FriendWithFriendship>({
					existingData,
					updateFn: (data, pagination) => ({
						pagination: { ...pagination, totalItems: pagination.totalItems + 1 },
						items: addFriendToList({ friendRequest, currentFriends: data?.items }),
					}),
				})
		);
		queryClient.setQueryData<InfiniteData<APIResponse<PaginatedResponse<FriendWithFriendship>>>>(
			friendKeys.filtered("online"),
			(existingData) =>
				updateInfinitePaginatedData<FriendWithFriendship>({
					existingData,
					updateFn: (data, pagination) => ({
						pagination: { ...pagination, totalItems: pagination.totalItems + 1 },
						items: addFriendToList({ friendRequest, currentFriends: data?.items }),
					}),
				})
		);
	}

	// Remove the accepted friend request from the lists
	const { friendRequestsData, pendingFriendRequestCountData, recentFriendRequestData } =
		await optimisticRemoveRequest({ friendReqId: friendRequest.id, queryClient });

	return {
		friendRequestsData,
		pendingFriendRequestCountData,
		recentFriendRequestData,
		friendsData,
		onlineFriendsData,
		newFriendsData,
	};
};

/**
 * Restores the original data in the cache if an error occurs during optimistic request acceptance.
 *
 * This function reverts the cache to its state before the optimistic update, ensuring data consistency.
 */
const optimisticAcceptRequestError = async ({
	context,
	queryClient,
}: {
	context?: {
		friendRequestsData?: InfiniteData<APIResponse<PaginatedResponse<FriendRequestWithRequestType>>>;
		recentFriendRequestData?: APIResponse<PaginatedResponse<FriendRequestWithRequestType>>;
		pendingFriendRequestCountData?: APIResponse<{ pending: number }>;
		friendsData?: InfiniteData<APIResponse<PaginatedResponse<FriendWithFriendship>>>;
		onlineFriendsData?: InfiniteData<APIResponse<PaginatedResponse<FriendWithFriendship>>>;
		newFriendsData?: InfiniteData<APIResponse<PaginatedResponse<FriendWithFriendship>>>;
	};
	queryClient: QueryClient;
}) => {
	if (!context) return;
	queryClient.setQueryData(friendRequestKeys.search(""), context.friendRequestsData);
	queryClient.setQueryData(friendRequestKeys.recent(), context.recentFriendRequestData);
	queryClient.setQueryData(friendRequestKeys.pendingCount(), context.pendingFriendRequestCountData);
	queryClient.setQueryData(friendKeys.searchAll(""), context.friendsData);
	queryClient.setQueryData(friendKeys.searchOnline(""), context.onlineFriendsData);
	queryClient.setQueryData(friendKeys.filtered("all"), context.friendsData);
	queryClient.setQueryData(friendKeys.filtered("online"), context.onlineFriendsData);
	queryClient.setQueryData(friendKeys.filtered("new"), context.newFriendsData);
};

/**
 * Refetches all data related to friend requests to ensure it is up-to-date.
 *
 * This function invalidates the cache for friend requests to trigger a refetch of the latest data.
 */
const refetchOptimisticRequests = ({ queryClient }: { queryClient: QueryClient }) => {
	queryClient.invalidateQueries({ queryKey: friendRequestKeys.all });
};

export {
	optimisticSendRequest,
	optimisticRemoveRequest,
	optimisticRemoveRequestError,
	optimisticAcceptRequest,
	optimisticAcceptRequestError,
	refetchOptimisticRequests,
};
