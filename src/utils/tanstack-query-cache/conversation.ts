import "client-only";

import type { QueryClient } from "@tanstack/react-query";
import type { APIResponse, UserWithoutPassword } from "@/types";

import { conversationKeys } from "@/constants/tanstack-query";

/**
 * Updates the participant's online status and last seen time in the query cache for a conversation.
 */
const updateParticipantStatus = ({
	conversationId,
	friendId,
	isOnline,
	lastSeen,
	queryClient,
}: {
	conversationId: string;
	friendId: string;
	isOnline: boolean;
	lastSeen: Date | null;
	queryClient: QueryClient;
}) => {
	queryClient.setQueryData<APIResponse<UserWithoutPassword>>(
		conversationKeys.participant(conversationId),
		(existingData) => {
			if (!existingData) return existingData;

			// Create a copy of the existing participant data
			const participant = { ...existingData.data };

			// If the participant matches the friendId, update their online status and last seen time
			if (participant && participant.id === friendId) {
				participant.lastSeen = lastSeen;
				participant.isOnline = isOnline;
			}

			return { ...existingData, data: participant as UserWithoutPassword };
		}
	);
};

// eslint-disable-next-line import/prefer-default-export
export { updateParticipantStatus };
