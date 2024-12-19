import type { ConversationsFilterType } from "@/types";

import { toast } from "sonner";

import { useCallback } from "react";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import usePusher from "@/hooks/use-pusher";

import { friendEvents } from "@/constants/pusher-events";
import { conversationKeys } from "@/constants/tanstack-query";

import {
	fetchConversationWithMetadata,
	fetchParticipantInConversation,
	fetchGroupConversationDetails,
	updateGroupConversationDetails,
	fetchGroupConversationMembership,
	clearConversation,
} from "@/services/conversation";

import { fetchFriendDetails } from "@/services/friendship";
import {
	updateParticipantStatus,
	updateGroupMembers,
} from "@/utils/tanstack-query-cache/conversation";
import {
	optimisticClearConversation,
	optimisticConversationError,
	refetchOptimisticConversation,
} from "@/utils/optimistic-updates/conversation";

/**
 *
 */
const useConversationWithMetadataQuery = ({
	filter = "all",
}: {
	filter?: ConversationsFilterType;
} = {}) => {
	const query = useInfiniteQuery({
		queryKey: conversationKeys.filtered(filter),
		queryFn: ({ pageParam }) =>
			fetchConversationWithMetadata({
				page: pageParam,
				groupOnly: filter === "group",
				includeUnreadOnly: filter === "unread",
			}),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => lastPage.data?.pagination.nextPage,
	});

	return query;
};

/**
 * Custom hook to fetch and manage the participant details in a conversation.
 * It listens to Pusher events for real-time updates on the participant's online status.
 */
const useParticipantInConversationQuery = (conversationId: string) => {
	const queryClient = useQueryClient();

	// Fetch participant details for the conversation using the conversation ID
	const query = useQuery({
		queryKey: conversationKeys.participant(conversationId),
		queryFn: () => fetchParticipantInConversation(conversationId),
	});

	/**
	 * Callback to handle the participant's status update.
	 * It fetches friend details, such as online status and last seen,
	 * and updates the query cache for the participant's status.
	 */
	const handleParticipantStatus = useCallback(
		(friendId?: string) => {
			if (!friendId) return;
			fetchFriendDetails(friendId).then((res) => {
				if (!res.data) return;
				const { isOnline, lastSeen } = res.data;
				updateParticipantStatus({ conversationId, friendId, isOnline, lastSeen, queryClient });
			});
		},
		[conversationId, queryClient]
	);

	// Subscribe to Pusher events for online and offline status of user
	usePusher<string>(conversationId, friendEvents.online, handleParticipantStatus);
	usePusher<string>(conversationId, friendEvents.offline, handleParticipantStatus);

	return query;
};

/**
 * Custom hook to fetch and subscribe to group conversation details.
 * This hook retrieves group conversation details via a query and subscribes to online/offline
 * status updates for group members, updating the online members count in real-time.
 */
const useGroupConversationDetailsQuery = (conversationId: string) => {
	const queryClient = useQueryClient();

	const query = useQuery({
		queryKey: conversationKeys.groupDetails(conversationId),
		queryFn: () => fetchGroupConversationDetails(conversationId),
	});

	const handleUpdateGroupeMembers = useCallback(
		(friendId?: string) => {
			if (!friendId) return;
			fetchGroupConversationDetails(conversationId).then((res) => {
				if (!res.data) return;
				const { members } = res.data;
				updateGroupMembers({ conversationId, members, queryClient });
			});
		},
		[conversationId, queryClient]
	);

	// Subscribe to Pusher events for online and offline status of user
	usePusher<string>(conversationId, friendEvents.online, handleUpdateGroupeMembers);
	usePusher<string>(conversationId, friendEvents.offline, handleUpdateGroupeMembers);

	return query;
};

/**
 * Custom hook to update group conversation details.
 */
const useUpdateGroupConversationDetails = () => {
	const queryClient = useQueryClient();

	return useMutation({
		// Function that performs the mutation to update the group conversation details
		mutationFn: updateGroupConversationDetails,

		// Invalidate relevant queries after the mutation is settled (either success or failure)
		onSettled: (_data, _error, { conversationId }) => {
			queryClient.invalidateQueries({ queryKey: conversationKeys.groupDetails(conversationId) });
		},
	});
};

/**
 * Custom hook to fetch the membership details of the current user in a specific conversation.
 */
const useGroupConversationMembershipQuery = (
	conversationId: string,
	{ enabled = true }: { enabled?: boolean } = {}
) => {
	const query = useQuery({
		queryKey: conversationKeys.groupMembership(conversationId),
		queryFn: () => fetchGroupConversationMembership(conversationId),
		enabled,
	});

	return query;
};

/**
 * Custom hook to handle the clearing of a conversation using optimistic updates.
 * It provides mutation functionality to clear a conversation and manages the state
 * of the conversation with React Query's query client.
 */
const useClearConversation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		// Function that performs the mutation to clear the conversation
		mutationFn: clearConversation,

		// Called before the mutation function is triggered to handle optimistic updates
		onMutate: ({ conversationId }) => optimisticClearConversation({ conversationId, queryClient }),

		// Called if the mutation fails, rolling back optimistic updates and showing an error message
		onError: (error, { conversationId }, context) => {
			optimisticConversationError({ conversationId, context, queryClient });
			toast.error(error.message);
		},

		// Called when the mutation either succeeds or fails, to refetch the conversation data
		onSettled: (_data, _error, { conversationId }) => {
			refetchOptimisticConversation({
				conversationId,
				queryClient,
			});
		},
	});
};

export {
	useConversationWithMetadataQuery,
	useParticipantInConversationQuery,
	useGroupConversationDetailsQuery,
	useUpdateGroupConversationDetails,
	useGroupConversationMembershipQuery,
	useClearConversation,
};
