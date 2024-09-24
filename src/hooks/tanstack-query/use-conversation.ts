import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import usePusher from "@/hooks/use-pusher";
import useCurrentUser from "@/hooks/tanstack-query/use-current-user";

import { friendEvents } from "@/constants/pusher-events";
import { conversationKeys } from "@/constants/tanstack-query";

import { fetchParticipantInConversation } from "@/services/conversation";

import { fetchFriendDetails } from "@/services/friendship";
import { updateParticipantStatus } from "@/utils/tanstack-query-cache/conversation";

/**
 * Custom hook to fetch and manage the participant details in a conversation.
 * It listens to Pusher events for real-time updates on the participant's online status.
 */
const useParticipantInConversationQuery = (conversationId: string) => {
	const { data } = useCurrentUser();
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

	// Subscribe to Pusher events for online and offline status updates using the current user ID
	usePusher<string>(data?.data?.id, friendEvents.online, handleParticipantStatus);
	usePusher<string>(data?.data?.id, friendEvents.offline, handleParticipantStatus);

	return query;
};

// eslint-disable-next-line import/prefer-default-export
export { useParticipantInConversationQuery };
