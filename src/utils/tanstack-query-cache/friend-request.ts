import "client-only";

import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type { APIResponse, FriendRequestWithRequestType, PaginatedResponse } from "@/types";

import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";
import { friendRequestKeys } from "@/constants/tanstack-query";
import { getPendingFriendRequestsCount } from "@/services/friend-request";
import {
	updateInfinitePaginatedData,
	updatePaginatedData,
} from "@/utils/tanstack-query-cache/helpers";

/**
 * Prepend a new friend request to the list of friend requests in the query cache.
 */
const prependFriendRequest = ({
	friendRequest,
	queryClient,
}: {
	friendRequest?: FriendRequestWithRequestType;
	queryClient: QueryClient;
}) => {
	queryClient.setQueryData<
		InfiniteData<APIResponse<PaginatedResponse<FriendRequestWithRequestType>>>
	>(friendRequestKeys.search(""), (existingData) =>
		updateInfinitePaginatedData<FriendRequestWithRequestType>({
			existingData,
			updateFn: (data, pagination) => {
				const items = data?.items ?? [];
				const itemExists = items.some((item) => item.id === friendRequest?.id);

				return {
					pagination: {
						...pagination,
						totalItems: !itemExists ? pagination.totalItems + 1 : pagination.totalItems,
					},
					items: friendRequest && !itemExists ? [friendRequest, ...items] : items,
				};
			},
		})
	);
};

/**
 * Remove a friend request from the list of friend requests in the query cache.
 */
const removeFriendRequest = ({
	friendReqId,
	queryClient,
}: {
	friendReqId?: string;
	queryClient: QueryClient;
}) => {
	queryClient.setQueryData<
		InfiniteData<APIResponse<PaginatedResponse<FriendRequestWithRequestType>>>
	>(friendRequestKeys.search(""), (existingData) =>
		updateInfinitePaginatedData<FriendRequestWithRequestType>({
			existingData,
			updateFn: (data, pagination) => {
				const items = data?.items ?? [];
				const itemExists = items.some((item) => item.id === friendReqId);

				return {
					pagination: {
						...pagination,
						totalItems: itemExists ? pagination.totalItems - 1 : pagination.totalItems,
					},
					items: itemExists ? items.filter((item) => item.id !== friendReqId) : items,
				};
			},
		})
	);
};

/**
 * Prepend a new friend request to the list of recent friend requests in the query cache.
 * If there are more than 10 requests, remove the oldest one.
 */
const prependRecentFriendRequest = ({
	friendRequest,
	queryClient,
}: {
	friendRequest?: FriendRequestWithRequestType;
	queryClient: QueryClient;
}) => {
	queryClient.setQueryData<APIResponse<PaginatedResponse<FriendRequestWithRequestType>>>(
		friendRequestKeys.recent(),
		(existingData) =>
			updatePaginatedData<FriendRequestWithRequestType>({
				existingData,
				updateFn: (data, pagination) => {
					const currentItems = data?.items ?? [];
					const itemExists = currentItems.some((item) => item.id === friendRequest?.id);
					const updatedRequests =
						friendRequest && !itemExists ? [friendRequest, ...currentItems] : currentItems;

					if (updatedRequests.length > DEFAULT_PAGE_SIZE) updatedRequests.pop();

					return {
						pagination: {
							...pagination,
							totalItems: !itemExists ? pagination.totalItems + 1 : pagination.totalItems,
						},
						items: updatedRequests,
					};
				},
			})
	);
};

/**
 * Remove a friend request from the list of recent friend requests in the query cache.
 */
const removeRecentFriendRequest = ({
	friendReqId,
	queryClient,
}: {
	friendReqId?: string;
	queryClient: QueryClient;
}) => {
	queryClient.setQueryData<APIResponse<PaginatedResponse<FriendRequestWithRequestType>>>(
		friendRequestKeys.recent(),
		(existingData) =>
			updatePaginatedData<FriendRequestWithRequestType>({
				existingData,
				updateFn: (data, pagination) => {
					const items = data?.items ?? [];
					const itemExists = items.some((item) => item.id === friendReqId);

					return {
						pagination: {
							...pagination,
							totalItems: itemExists ? pagination.totalItems - 1 : pagination.totalItems,
						},
						items: itemExists ? items.filter((item) => item.id !== friendReqId) : items,
					};
				},
			})
	);
};

/**
 * Increase the count of pending friend requests in the query cache.
 */
const increaseFriendRequestCount = ({
	friendRequest,
	queryClient,
}: {
	friendRequest?: FriendRequestWithRequestType;
	queryClient: QueryClient;
}) => {
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
 * Decrease the count of pending friend requests in the query cache.
 */
const decreaseFriendRequestCount = ({
	friendReqId,
	queryClient,
}: {
	friendReqId?: string;
	queryClient: QueryClient;
}) => {
	queryClient.setQueryData<APIResponse<{ pending: number }>>(
		friendRequestKeys.pendingCount(),
		(existingData) => {
			if (!existingData) return existingData;

			const { data, status, message } = existingData;
			let pendingCount = data?.pending ?? 0;
			if (friendReqId && pendingCount > 0) pendingCount -= 1;

			return { status, message, data: { pending: pendingCount } };
		}
	);
};

/**
 * Sync the count of pending friend requests in the query cache.
 */
const syncFriendRequestCount = async ({ queryClient }: { queryClient: QueryClient }) => {
	const pendingCount = await getPendingFriendRequestsCount();

	queryClient.setQueryData<APIResponse<{ pending: number }>>(
		friendRequestKeys.pendingCount(),
		(existingData) => {
			if (!existingData) return existingData;

			const { status, message } = existingData;
			return { status, message, data: { pending: pendingCount } };
		}
	);
};

export {
	prependFriendRequest,
	removeFriendRequest,
	prependRecentFriendRequest,
	removeRecentFriendRequest,
	increaseFriendRequestCount,
	decreaseFriendRequestCount,
	syncFriendRequestCount,
};
