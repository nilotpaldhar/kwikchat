import type { ConversationsFilterType } from "@/types";

import { toast } from "sonner";

import { useCallback } from "react";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import usePusher from "@/hooks/use-pusher";
import useCurrentUser from "@/hooks/tanstack-query/use-current-user";

import { conversationKeys, messageKeys } from "@/constants/tanstack-query";
import { friendEvents, conversationEvents, memberEvents } from "@/constants/pusher-events";

import {
	fetchConversationsWithMetadata,
	fetchConversationDetails,
	fetchParticipantInConversation,
	fetchGroupConversationDetails,
	updateGroupConversationDetails,
	fetchGroupConversationMembership,
	clearConversation,
	deleteGroupConversation,
	deleteConversation,
	exitGroupConversation,
} from "@/services/conversation";
import { fetchUnreadMessagesCount } from "@/services/message";

import { fetchFriendDetails } from "@/services/friendship";
import {
	updateParticipantStatus,
	updateGroupMembers,
	prependConversation,
	updateConversation,
	removeConversation,
	updateConversationUnreadMessagesCount,
} from "@/utils/tanstack-query-cache/conversation";
import {
	optimisticClearConversation,
	optimisticClearConversationError,
	refetchOptimisticConversation,
} from "@/utils/optimistic-updates/conversation";

import generateConversationLifecycleChannel, {
	ConversationLifecycle,
} from "@/utils/pusher/generate-conversation-lifecycle-channel";
import generateMemberActionChannel, {
	type MemberAction,
} from "@/utils/pusher/generate-member-action-channel";
import generateFriendChannel from "@/utils/pusher/generate-friend-channel";

/**
 * Custom hook to manage conversations with metadata, including real-time updates via Pusher.
 */
const useConversationWithMetadataQuery = ({
	filter = "all",
}: {
	filter?: ConversationsFilterType;
} = {}) => {
	// Retrieve the current user data
	const { data } = useCurrentUser();

	// Create an instance of the query client for managing cache and query states
	const queryClient = useQueryClient();

	// Infinite query for fetching conversations with metadata
	const query = useInfiniteQuery({
		queryKey: conversationKeys.filtered(filter),
		queryFn: ({ pageParam }) =>
			fetchConversationsWithMetadata({
				page: pageParam,
				groupOnly: filter === "group",
				includeUnreadOnly: filter === "unread",
			}),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => lastPage.data?.pagination.nextPage,
	});

	// Helper function to generate a Pusher channel name for conversation lifecycle events
	const createConversationChannelName = useCallback(
		(eventType: ConversationLifecycle) => {
			const currentUserId = data?.data?.id;

			// Return undefined if the user is not authenticated
			if (!currentUserId) return undefined;

			// Generate the channel name based on the user ID and event type
			return generateConversationLifecycleChannel({
				receiverId: currentUserId,
				lifecycle: eventType,
			});
		},
		[data?.data?.id]
	);

	// Pusher subscription for handling new conversation events
	usePusher<string>(
		createConversationChannelName("created"),
		conversationEvents.newConversation,
		(conversationId) => {
			if (!conversationId) return;

			// Fetch conversation details and prepend them to the query cache
			fetchConversationDetails({ conversationId }).then((res) =>
				prependConversation({ conversation: res.data!, queryClient })
			);
		}
	);

	// Pusher subscription for handling conversation updates
	usePusher<string>(
		createConversationChannelName("updated"),
		conversationEvents.updateConversation,
		(conversationId) => {
			if (!conversationId) return;

			// Fetch conversation details, update the cache, and invalidate message queries
			fetchConversationDetails({ conversationId }).then((res) => {
				updateConversation({ conversation: res.data!, queryClient });
				queryClient.invalidateQueries({ queryKey: messageKeys.all(conversationId) });
			});
		}
	);

	// Pusher subscription for handling updates to unread message counts
	usePusher<string>(
		createConversationChannelName("updated_unread_count"),
		conversationEvents.updateConversationUnreadMessages,
		(conversationId) => {
			if (!conversationId) return;

			// Fetch the unread messages count and update it in the cache
			fetchUnreadMessagesCount({ conversationId }).then((res) => {
				updateConversationUnreadMessagesCount({
					conversationId,
					unreadMessages: res.data?.unreadMessages,
					queryClient,
				});
			});
		}
	);

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
	const friendChannel = generateFriendChannel({ uid: conversationId, channelType: "default" });
	usePusher<string>(friendChannel, friendEvents.online, handleParticipantStatus);
	usePusher<string>(friendChannel, friendEvents.offline, handleParticipantStatus);

	return query;
};

/**
 * Custom hook to fetch and subscribe to group conversation details.
 * This hook retrieves group conversation details via a query and subscribes to online/offline
 * status updates for group members, updating the online members count in real-time.
 */
const useGroupConversationDetailsQuery = (conversationId: string) => {
	// Retrieve the current user data
	const { data } = useCurrentUser();

	// Create an instance of the query client for managing cache and query states
	const queryClient = useQueryClient();

	// Define a query to fetch group conversation details
	const query = useQuery({
		queryKey: conversationKeys.groupDetails(conversationId),
		queryFn: () => fetchGroupConversationDetails(conversationId),
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

	// Function to handle updating group members
	const handleUpdateGroupMembers = useCallback(
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

	// Function to invalidate the group details query
	const handleInvalidateGroupDetailsQuery = () => {
		queryClient.invalidateQueries({ queryKey: conversationKeys.groupDetails(conversationId) });
	};

	// Subscribe to Pusher events for friend status changes
	const friendChannel = generateFriendChannel({ uid: conversationId, channelType: "default" });
	usePusher<string>(friendChannel, friendEvents.online, handleUpdateGroupMembers);
	usePusher<string>(friendChannel, friendEvents.offline, handleUpdateGroupMembers);

	// Subscribe to Pusher events for member actions
	usePusher(
		createMemberActionChannelName("exit"),
		memberEvents.exit,
		handleInvalidateGroupDetailsQuery
	);
	usePusher(
		createMemberActionChannelName("removed"),
		memberEvents.remove,
		handleInvalidateGroupDetailsQuery
	);

	return query;
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
			optimisticClearConversationError({ conversationId, context, queryClient });
			toast.error(error.message);
		},

		// Called when the mutation either succeeds or fails, to refetch the conversation data
		onSettled: (_data, _error, { conversationId }) => {
			refetchOptimisticConversation({
				conversationId,
				opsType: "clear_conversation_messages",
				queryClient,
			});
		},
	});
};

/**
 * Custom hook for deleting a group conversation.
 */
const useDeleteGroupConversation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteGroupConversation,

		onError: (error) => {
			toast.error(error.message);
		},

		onSuccess: (data, { conversationId }) => {
			toast.success(data.message);
			removeConversation({ conversationId, queryClient });
		},
	});
};

/**
 * Custom hook to handle the deletion of a conversation.
 */
const useDeleteConversation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteConversation,

		onError: (error) => {
			toast.error(error.message);
		},

		onSuccess: (data, { conversationId }) => {
			toast.success(data.message);
			removeConversation({ conversationId, queryClient });
		},
	});
};

/**
 * Custom hook for exiting a group conversation.
 */
const useExitGroupConversation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: exitGroupConversation,

		onError: (error) => {
			toast.error(error.message);
		},

		onSuccess: (data, { conversationId }) => {
			toast.success(data.message);
			removeConversation({ conversationId, queryClient });
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
	useDeleteGroupConversation,
	useDeleteConversation,
	useExitGroupConversation,
};
