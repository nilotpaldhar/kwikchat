import "server-only";

import { pusherServer } from "@/lib/pusher/server";
import generateMemberActionChannel, {
	type MemberAction,
} from "@/utils/pusher/generate-member-action-channel";

/**
 * Broadcasts a member-related action event to specified group chat channels.
 */
const broadcastMemberAction = async <MemberPayload>({
	conversationId,
	receiverIds,
	eventType,
	eventName,
	payload,
}: {
	conversationId: string;
	receiverIds: string[];
	eventType: MemberAction;
	eventName: string;
	payload: MemberPayload;
}) => {
	try {
		// Generate Pusher channel names for all receivers based on their IDs
		const channelIds = receiverIds.map((receiverId) =>
			generateMemberActionChannel({
				conversationId,
				receiverId,
				action: eventType,
			})
		);

		// Trigger the event on the Pusher server for the specified channels
		await pusherServer.trigger(channelIds, eventName, payload);
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error("Failed to broadcast group message.");
	}
};

// eslint-disable-next-line import/prefer-default-export
export { broadcastMemberAction };
