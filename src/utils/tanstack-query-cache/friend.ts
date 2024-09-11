import "client-only";

import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type { APIResponse, FriendWithFriendship, PaginatedResponse } from "@/types";
import type { PaginationMetadata } from "@/utils/general/calculate-pagination";

import { friendKeys } from "@/constants/tanstack-query";

import isRecentFriendship from "@/utils/friend/is-recent-friendship";
import { updateInfinitePaginatedData } from "@/utils/tanstack-query-cache/helpers";

/**
 * Add a friend to the list if not already present.
 */
const addFriend = ({
	friend,
	data,
	pagination,
}: {
	friend?: FriendWithFriendship;
	data: PaginatedResponse<FriendWithFriendship> | undefined;
	pagination: PaginationMetadata;
}) => {
	const items = data?.items ?? [];
	const itemExists = items.some((item) => item.id === friend?.id);

	return {
		pagination: {
			...pagination,
			totalItems: !itemExists ? pagination.totalItems + 1 : pagination.totalItems,
		},
		items: friend && !itemExists ? [friend, ...items] : items,
	};
};

/**
 * Remove a friend from the list.
 */
const removeFriend = ({
	friendId,
	data,
	pagination,
}: {
	friendId: string | undefined;
	data: PaginatedResponse<FriendWithFriendship> | undefined;
	pagination: PaginationMetadata;
}) => {
	const items = data?.items ?? [];
	const itemExists = items.some((item) => item.id === friendId);

	return {
		pagination: {
			...pagination,
			totalItems: itemExists ? pagination.totalItems - 1 : pagination.totalItems,
		},
		items: itemExists ? items.filter((item) => item.id !== friendId) : items,
	};
};

/**
 * Prepend a friend to the 'All Friends' list.
 */
const prependAllFriend = ({
	friend,
	queryClient,
}: {
	friend?: FriendWithFriendship;
	queryClient: QueryClient;
}) => {
	queryClient.setQueryData<InfiniteData<APIResponse<PaginatedResponse<FriendWithFriendship>>>>(
		friendKeys.searchAll(""),
		(existingData) =>
			updateInfinitePaginatedData<FriendWithFriendship>({
				existingData,
				updateFn: (data, pagination) => addFriend({ friend, data, pagination }),
			})
	);
};

/**
 * Prepend a friend to the 'Online Friends' list.
 */
const prependOnlineFriend = ({
	friend,
	queryClient,
}: {
	friend?: FriendWithFriendship;
	queryClient: QueryClient;
}) => {
	queryClient.setQueryData<InfiniteData<APIResponse<PaginatedResponse<FriendWithFriendship>>>>(
		friendKeys.searchOnline(""),
		(existingData) =>
			updateInfinitePaginatedData<FriendWithFriendship>({
				existingData,
				updateFn: (data, pagination) => addFriend({ friend, data, pagination }),
			})
	);
};

/**
 * Prepend a friend to the filtered 'Online Friends' list.
 */
const prependFilteredOnlineFriend = ({
	friend,
	queryClient,
}: {
	friend?: FriendWithFriendship;
	queryClient: QueryClient;
}) => {
	queryClient.setQueryData<InfiniteData<APIResponse<PaginatedResponse<FriendWithFriendship>>>>(
		friendKeys.filtered("online"),
		(existingData) =>
			updateInfinitePaginatedData<FriendWithFriendship>({
				existingData,
				updateFn: (data, pagination) => addFriend({ friend, data, pagination }),
			})
	);
};

/**
 * Prepend a friend to both 'All' and 'New' friends lists if they have a recent friendship.
 */
const prependFilteredFriend = ({
	friend,
	queryClient,
}: {
	friend?: FriendWithFriendship;
	queryClient: QueryClient;
}) => {
	queryClient.setQueryData<InfiniteData<APIResponse<PaginatedResponse<FriendWithFriendship>>>>(
		friendKeys.filtered("all"),
		(existingData) =>
			updateInfinitePaginatedData<FriendWithFriendship>({
				existingData,
				updateFn: (data, pagination) => addFriend({ friend, data, pagination }),
			})
	);

	if (friend?.friendship.createdAt && isRecentFriendship(friend?.friendship.createdAt)) {
		queryClient.setQueryData<InfiniteData<APIResponse<PaginatedResponse<FriendWithFriendship>>>>(
			friendKeys.filtered("new"),
			(existingData) =>
				updateInfinitePaginatedData<FriendWithFriendship>({
					existingData,
					updateFn: (data, pagination) => addFriend({ friend, data, pagination }),
				})
		);
	}
};

/**
 * Remove a friend from the 'All' and/or 'Online' friends lists.
 */
const removeFromFriendsList = ({
	friendId,
	onlyOnline = false,
	queryClient,
}: {
	friendId?: string;
	onlyOnline?: boolean;
	queryClient: QueryClient;
}) => {
	if (!onlyOnline) {
		queryClient.setQueryData<InfiniteData<APIResponse<PaginatedResponse<FriendWithFriendship>>>>(
			friendKeys.searchAll(""),
			(existingData) =>
				updateInfinitePaginatedData<FriendWithFriendship>({
					existingData,
					updateFn: (data, pagination) => removeFriend({ friendId, data, pagination }),
				})
		);
	}

	queryClient.setQueryData<InfiniteData<APIResponse<PaginatedResponse<FriendWithFriendship>>>>(
		friendKeys.searchOnline(""),
		(existingData) =>
			updateInfinitePaginatedData<FriendWithFriendship>({
				existingData,
				updateFn: (data, pagination) => removeFriend({ friendId, data, pagination }),
			})
	);
};

/**
 * Remove a friend from filtered lists (e.g., 'all', 'new', 'online').
 */
const removeFromFilteredFriendsList = ({
	friendId,
	onlyOnline = false,
	queryClient,
}: {
	friendId?: string;
	onlyOnline?: boolean;
	queryClient: QueryClient;
}) => {
	if (!onlyOnline) {
		queryClient.setQueryData<InfiniteData<APIResponse<PaginatedResponse<FriendWithFriendship>>>>(
			friendKeys.filtered("all"),
			(existingData) =>
				updateInfinitePaginatedData<FriendWithFriendship>({
					existingData,
					updateFn: (data, pagination) => removeFriend({ friendId, data, pagination }),
				})
		);

		queryClient.setQueryData<InfiniteData<APIResponse<PaginatedResponse<FriendWithFriendship>>>>(
			friendKeys.filtered("new"),
			(existingData) =>
				updateInfinitePaginatedData<FriendWithFriendship>({
					existingData,
					updateFn: (data, pagination) => removeFriend({ friendId, data, pagination }),
				})
		);
	}

	queryClient.setQueryData<InfiniteData<APIResponse<PaginatedResponse<FriendWithFriendship>>>>(
		friendKeys.filtered("online"),
		(existingData) =>
			updateInfinitePaginatedData<FriendWithFriendship>({
				existingData,
				updateFn: (data, pagination) => removeFriend({ friendId, data, pagination }),
			})
	);
};

export {
	prependAllFriend,
	prependOnlineFriend,
	prependFilteredFriend,
	prependFilteredOnlineFriend,
	removeFromFriendsList,
	removeFromFilteredFriendsList,
};
