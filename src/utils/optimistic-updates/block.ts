import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type { APIResponse, BlockedUser, PaginatedResponse, FriendWithFriendship } from "@/types";

import { blockedUserKeys, friendKeys } from "@/constants/tanstack-query";
import {
	getInfiniteQueryData,
	updateInfinitePaginatedData,
} from "@/utils/optimistic-updates/helpers";
import isRecentFriendship from "@/utils/friend/is-recent-friendship";

/**
 * Optimistically updates the cache when a user blocks a friend.
 *
 * This function temporarily updates the UI to reflect that a friend has been blocked
 * without waiting for the server response. It adds the friend to the blocked users list
 * and removes them from various friend lists.
 */
const optimisticBlock = async ({
	friend,
	queryClient,
}: {
	friend: FriendWithFriendship;
	queryClient: QueryClient;
}) => {
	// Cancel any ongoing queries for blocked users and friends to ensure consistency
	await queryClient.cancelQueries({ queryKey: blockedUserKeys.search("") });
	await queryClient.cancelQueries({ queryKey: friendKeys.searchAll("") });
	await queryClient.cancelQueries({ queryKey: friendKeys.searchOnline("") });
	await queryClient.cancelQueries({ queryKey: friendKeys.filtered("all") });
	await queryClient.cancelQueries({ queryKey: friendKeys.filtered("online") });
	await queryClient.cancelQueries({ queryKey: friendKeys.filtered("new") });

	// Retrieve the current data for blocked users, all friends, online friends, and new friends
	const blockedUsersData = getInfiniteQueryData<BlockedUser>({
		keys: blockedUserKeys.search(""),
		queryClient,
	});
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

	// Add the friend to the blocked users list
	queryClient.setQueryData<InfiniteData<APIResponse<PaginatedResponse<BlockedUser>>>>(
		blockedUserKeys.search(""),
		(existingData) =>
			updateInfinitePaginatedData<BlockedUser>({
				existingData,
				updateFn: (data, pagination) => {
					const { friendship, ...user } = friend;
					const newBlockedUser: BlockedUser = { user, blockedAt: new Date() };
					const currentBlockedUsers = data?.items ?? [];

					return {
						pagination: { ...pagination, totalItems: pagination.totalItems + 1 },
						items: [newBlockedUser, ...currentBlockedUsers],
					};
				},
			})
	);

	// Remove the friend from the all friends list
	queryClient.setQueryData<InfiniteData<APIResponse<PaginatedResponse<FriendWithFriendship>>>>(
		friendKeys.searchAll(""),
		(existingData) =>
			updateInfinitePaginatedData<FriendWithFriendship>({
				existingData,
				updateFn: (data, pagination) => ({
					pagination: { ...pagination, totalItems: pagination.totalItems - 1 },
					items: (data?.items ?? []).filter((item) => item.id !== friend.id),
				}),
			})
	);

	// Remove from the filtered 'all friends' list
	queryClient.setQueryData<InfiniteData<APIResponse<PaginatedResponse<FriendWithFriendship>>>>(
		friendKeys.filtered("all"),
		(existingData) =>
			updateInfinitePaginatedData<FriendWithFriendship>({
				existingData,
				updateFn: (data, pagination) => ({
					pagination: { ...pagination, totalItems: pagination.totalItems - 1 },
					items: (data?.items ?? []).filter((item) => item.id !== friend.id),
				}),
			})
	);

	// If the friend is online, remove from the online friends list
	if (friend.isOnline) {
		queryClient.setQueryData<InfiniteData<APIResponse<PaginatedResponse<FriendWithFriendship>>>>(
			friendKeys.searchOnline(""),
			(existingData) =>
				updateInfinitePaginatedData<FriendWithFriendship>({
					existingData,
					updateFn: (data, pagination) => ({
						pagination: { ...pagination, totalItems: pagination.totalItems - 1 },
						items: (data?.items ?? []).filter((item) => item.id !== friend.id),
					}),
				})
		);

		queryClient.setQueryData<InfiniteData<APIResponse<PaginatedResponse<FriendWithFriendship>>>>(
			friendKeys.filtered("online"),
			(existingData) =>
				updateInfinitePaginatedData<FriendWithFriendship>({
					existingData,
					updateFn: (data, pagination) => ({
						pagination: { ...pagination, totalItems: pagination.totalItems - 1 },
						items: (data?.items ?? []).filter((item) => item.id !== friend.id),
					}),
				})
		);
	}

	// If the friendship is recent, remove from the 'new friends' list
	if (isRecentFriendship(friend.friendship.createdAt)) {
		queryClient.setQueryData<InfiniteData<APIResponse<PaginatedResponse<FriendWithFriendship>>>>(
			friendKeys.filtered("new"),
			(existingData) =>
				updateInfinitePaginatedData<FriendWithFriendship>({
					existingData,
					updateFn: (data, pagination) => ({
						pagination: { ...pagination, totalItems: pagination.totalItems - 1 },
						items: (data?.items ?? []).filter((item) => item.id !== friend.id),
					}),
				})
		);
	}

	return { blockedUsersData, friendsData, onlineFriendsData, newFriendsData };
};

/**
 * Handles errors in the optimistic block operation and restores the original data.
 *
 * If an error occurs during the blocking operation, this function resets the cached data
 * back to its state before the optimistic update, ensuring data consistency.
 */
const optimisticBlockError = ({
	context,
	queryClient,
}: {
	context?: {
		blockedUsersData?: InfiniteData<APIResponse<PaginatedResponse<BlockedUser>>>;
		friendsData?: InfiniteData<APIResponse<PaginatedResponse<FriendWithFriendship>>>;
		onlineFriendsData?: InfiniteData<APIResponse<PaginatedResponse<FriendWithFriendship>>>;
		newFriendsData?: InfiniteData<APIResponse<PaginatedResponse<FriendWithFriendship>>>;
	};
	queryClient: QueryClient;
}) => {
	if (!context) return;
	queryClient.setQueryData(blockedUserKeys.search(""), context.blockedUsersData);
	queryClient.setQueryData(friendKeys.searchAll(""), context.friendsData);
	queryClient.setQueryData(friendKeys.searchOnline(""), context.onlineFriendsData);
	queryClient.setQueryData(friendKeys.filtered("all"), context.friendsData);
	queryClient.setQueryData(friendKeys.filtered("online"), context.onlineFriendsData);
	queryClient.setQueryData(friendKeys.filtered("new"), context.newFriendsData);
};

/**
 * Optimistically updates the cache when a user unblocks someone.
 *
 * This function temporarily updates the UI to reflect that a user has been unblocked
 * without waiting for the server response. It removes the user from the blocked users list.
 */
const optimisticUnblock = async ({
	blockedUserId,
	queryClient,
}: {
	blockedUserId: string;
	queryClient: QueryClient;
}) => {
	// Cancel any ongoing queries for blocked users
	await queryClient.cancelQueries({ queryKey: blockedUserKeys.search("") });

	// Retrieve the current data for blocked users
	const blockedUsersData = getInfiniteQueryData<BlockedUser>({
		keys: blockedUserKeys.search(""),
		queryClient,
	});

	// Remove the user from the blocked users list
	queryClient.setQueryData<InfiniteData<APIResponse<PaginatedResponse<BlockedUser>>>>(
		blockedUserKeys.search(""),
		(existingData) =>
			updateInfinitePaginatedData({
				existingData,
				updateFn: (data, pagination) => ({
					pagination: { ...pagination, totalItems: pagination.totalItems - 1 },
					items: (data?.items ?? []).filter((item) => item.user.id !== blockedUserId),
				}),
			})
	);

	return { blockedUsersData };
};

/**
 * Restores the blocked users data in case of an error during optimistic unblock.
 *
 * If an error occurs while unblocking, this function resets the cached blocked users data
 * back to its previous state, ensuring data consistency.
 */
const optimisticUnblockError = ({
	context,
	queryClient,
}: {
	context?: {
		blockedUsersData?: InfiniteData<APIResponse<PaginatedResponse<BlockedUser>>>;
	};
	queryClient: QueryClient;
}) => {
	if (!context) return;
	queryClient.setQueryData(blockedUserKeys.search(""), context.blockedUsersData);
};

/**
 * Refetches both blocked users and friend data after optimistic updates.
 *
 * This function invalidates the queries for blocked users and friends, forcing them to
 * refetch the latest data from the server to ensure data accuracy.
 */
const refetchOptimisticBlockedUsers = ({ queryClient }: { queryClient: QueryClient }) => {
	queryClient.invalidateQueries({ queryKey: blockedUserKeys.all });
	queryClient.invalidateQueries({ queryKey: friendKeys.all });
};

export {
	optimisticUnblock,
	optimisticBlockError,
	optimisticBlock,
	optimisticUnblockError,
	refetchOptimisticBlockedUsers,
};
