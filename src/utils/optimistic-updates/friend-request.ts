import { nanoid } from "nanoid";

import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type {
	APIResponse,
	FriendRequestWithRequestType,
	FriendWithFriendship,
	PaginatedResponse,
} from "@/types";

import { friendKeys, friendRequestKeys } from "@/constants/tanstack-query";

import {
	prependFriendRequest,
	prependRecentFriendRequest,
	increaseFriendRequestCount,
	removeFriendRequest,
	removeRecentFriendRequest,
	decreaseFriendRequestCount,
} from "@/utils/tanstack-query-cache/friend-request";
import { prependAllFriend, prependFilteredFriend } from "@/utils/tanstack-query-cache/friend";
import { getQueryData, getInfiniteQueryData } from "@/utils/tanstack-query-cache/helpers";

const createFriendFromRequest = (friendRequest: FriendRequestWithRequestType) => {
	const { receiverId, senderId, sender } = friendRequest;

	if (!sender) return undefined;

	const newFriend: FriendWithFriendship = {
		...sender,
		friendship: {
			id: nanoid(),
			createdAt: new Date(),
			friendId: senderId,
			userId: receiverId,
		},
	};

	return newFriend;
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
	prependFriendRequest({ friendRequest, queryClient });

	// Update the recent friend requests list in the cache
	prependRecentFriendRequest({ friendRequest, queryClient });

	// Update the count of pending friend requests in the cache
	increaseFriendRequestCount({ friendRequest, queryClient });
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
	removeFriendRequest({ friendReqId, queryClient });

	// Remove the friend request from the recent friend request list
	removeRecentFriendRequest({ friendReqId, queryClient });

	// Decrement the pending friend request count
	decreaseFriendRequestCount({ friendReqId, queryClient });

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
	const friend = createFriendFromRequest(friendRequest);

	// Cancel ongoing queries related to friends to ensure cache consistency
	await queryClient.cancelQueries({ queryKey: friendKeys.searchAll("") });
	await queryClient.cancelQueries({ queryKey: friendKeys.searchOnline("") });
	await queryClient.cancelQueries({ queryKey: friendKeys.filtered("all") });
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
	prependAllFriend({ friend, queryClient });

	// Update filtered lists: all friends and new friends
	prependFilteredFriend({ friend, queryClient });

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
