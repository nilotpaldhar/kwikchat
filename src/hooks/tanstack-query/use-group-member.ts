import { toast } from "sonner";

import { useCallback } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import usePusher from "@/hooks/use-pusher";
import useCurrentUser from "@/hooks/tanstack-query/use-current-user";

import { memberEvents } from "@/constants/pusher-events";
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
import { removeGroupMember as removeGroupMemberCache } from "@/utils/tanstack-query-cache/group-member";

import generateMemberActionChannel, {
	type MemberAction,
} from "@/utils/pusher/generate-member-action-channel";

/**
 * Custom hook for managing and querying group members based on a given conversation ID.
 */
const useGroupMembersQuery = ({ conversationId }: { conversationId: string }) => {
	// Retrieve the current user data
	const { data } = useCurrentUser();

	// Create an instance of the query client for managing cache and query states
	const queryClient = useQueryClient();

	// Define an infinite query to fetch group members
	const query = useInfiniteQuery({
		queryKey: groupMemberKeys.all(conversationId),
		queryFn: ({ pageParam }) => fetchGroupMembers({ conversationId, page: pageParam }),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => lastPage.data?.pagination.nextPage,
	});

	// Function to generate a channel name for member actions
	const createMemberActionChannelName = useCallback(
		(eventType: MemberAction) => {
			const currentUserId = data?.data?.id;

			if (!currentUserId) return undefined;

			return generateMemberActionChannel({
				conversationId,
				receiverId: currentUserId,
				action: eventType,
			});
		},
		[data?.data?.id, conversationId]
	);

	// Function to handle removing a group member
	const handleRemoveGroupMember = (memberId?: string) => {
		if (!memberId) return;
		removeGroupMemberCache({ conversationId, memberId, queryClient });
	};

	// Subscribe to Pusher events for member actions
	usePusher<string>(
		createMemberActionChannelName("exit"),
		memberEvents.exit,
		handleRemoveGroupMember
	);
	usePusher<string>(
		createMemberActionChannelName("removed"),
		memberEvents.exit,
		handleRemoveGroupMember
	);

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
