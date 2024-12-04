import { toast } from "sonner";

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { groupMemberKeys } from "@/constants/tanstack-query";

import {
	fetchGroupMembers,
	addGroupMembers,
	updateGroupMemberRole,
	removeGroupMember,
} from "@/services/group-member";

import {
	optimisticUpdateGroupMemberRole,
	optimisticRemoveGroupMember,
	refetchOptimisticGroupMembers,
	optimisticGroupMembersError,
} from "@/utils/optimistic-updates/group-member";

/**
 * Custom hook for querying group members in a paginated format.
 */
const useGroupMembersQuery = ({ conversationId }: { conversationId: string }) => {
	const query = useInfiniteQuery({
		queryKey: groupMemberKeys.all(conversationId),
		queryFn: ({ pageParam }) => fetchGroupMembers({ conversationId, page: pageParam }),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => lastPage.data?.pagination.nextPage,
	});

	return query;
};

/**
 * Custom hook for adding members to a group conversation.
 */
const useAddGroupMembers = () => {
	// Access the query client to manage cached queries.
	const queryClient = useQueryClient();

	return useMutation({
		// The mutation function that performs the API request to add group members.
		mutationFn: addGroupMembers,

		// Callback executed upon successful mutation.
		onSuccess: ({ message }, { conversationId }) => {
			// Display a success message to the user.
			toast.success(message);

			// Invalidate the group members query to refetch updated data for the conversation.
			queryClient.invalidateQueries({ queryKey: groupMemberKeys.all(conversationId) });
		},
	});
};

/**
 * Custom hook to update a group member's role.
 */
const useUpdateGroupMemberRole = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateGroupMemberRole,

		// Perform optimistic updates before the mutation is executed
		onMutate: ({ conversationId, memberId, memberRole }) =>
			optimisticUpdateGroupMemberRole({ conversationId, memberId, memberRole, queryClient }),

		// Handle errors that occur during the mutation
		onError: (_error, { conversationId }, context) => {
			optimisticGroupMembersError({ conversationId, context, queryClient });
		},

		// Refetch group members to ensure data consistency after mutation is completed
		onSettled: (_data, _error, { conversationId }) => {
			refetchOptimisticGroupMembers({
				conversationId,
				queryClient,
			});
		},
	});
};

/**
 * Custom hook to remove a group member.
 */
const useRemoveGroupMember = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: removeGroupMember,

		// Perform optimistic updates before the mutation is executed
		onMutate: ({ conversationId, memberId }) =>
			optimisticRemoveGroupMember({ conversationId, memberId, queryClient }),

		// Handle errors that occur during the mutation
		onError: (_error, { conversationId }, context) => {
			optimisticGroupMembersError({ conversationId, context, queryClient });
		},

		// Refetch group members to ensure data consistency after mutation is completed
		onSettled: (_data, _error, { conversationId }) => {
			refetchOptimisticGroupMembers({
				conversationId,
				queryClient,
			});
		},
	});
};

export { useGroupMembersQuery, useAddGroupMembers, useUpdateGroupMemberRole, useRemoveGroupMember };
