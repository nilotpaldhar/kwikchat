import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { blockedUserKeys } from "@/constants/tanstack-query";
import { fetchBlockedUsers, blockUser, unblockUser } from "@/services/block";
import {
	optimisticBlock,
	optimisticUnblock,
	optimisticBlockError,
	optimisticUnblockError,
	refetchOptimisticBlockedUsers,
} from "@/utils/optimistic-updates/block";

/**
 * Hook to fetch blocked users with pagination and optional search query.
 */
const useBlockedUsersQuery = (searchQuery?: string) => {
	const query = useInfiniteQuery({
		queryKey: blockedUserKeys.search(searchQuery || ""),
		queryFn: ({ pageParam }) => fetchBlockedUsers({ page: pageParam, query: searchQuery }),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => lastPage.data?.pagination.nextPage,
	});

	return query;
};

/**
 * Hook to block a user with optimistic updates for better UI experience.
 */
const useBlock = () => {
	const queryClient = useQueryClient();

	return useMutation({
		// Function to block a user
		mutationFn: blockUser,

		// Optimistic update: immediately block the user in the cache before the server response
		onMutate: (friend) => optimisticBlock({ friend, queryClient }),

		// Error handling: if the mutation fails, revert to the previous cache state
		onError: (error, _blockedUserId, context) => {
			optimisticBlockError({ queryClient, context });
			toast.error(error.message);
		},

		// After mutation settles (either success or failure), refetch the relevant data
		onSettled: () => refetchOptimisticBlockedUsers({ queryClient }),

		onSuccess: ({ data }) => {
			const username = data?.user.username ?? "unknown";
			toast.success(
				`You have successfully blocked "${username}". They will no longer be able to interact with you.`
			);
		},
	});
};

/**
 * Hook to unblock a user with optimistic updates for better UI experience.
 */
const useUnblock = () => {
	const queryClient = useQueryClient();

	return useMutation({
		// Function to unblock a user
		mutationFn: unblockUser,

		// Optimistic update: immediately remove the user from the blocked list in the cache
		onMutate: (blockedUserId) => optimisticUnblock({ blockedUserId, queryClient }),

		// Error handling: if the mutation fails, revert to the previous cache state
		onError: (error, _friendReqId, context) => {
			optimisticUnblockError({ queryClient, context });
			toast.error(error.message);
		},

		// After mutation settles (either success or failure), refetch the relevant data
		onSettled: () => refetchOptimisticBlockedUsers({ queryClient }),

		onSuccess: ({ message }) => {
			toast.success(message);
		},
	});
};

export { useBlockedUsersQuery, useBlock, useUnblock };
