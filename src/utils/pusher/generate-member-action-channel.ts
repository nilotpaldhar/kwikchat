export type MemberAction = "exit" | "removed";

/**
 * Generates a Pusher channel name for group chat member actions.
 */
const generateMemberActionChannel = ({
	action,
	conversationId,
	receiverId,
}: {
	action: MemberAction;
	conversationId: string;
	receiverId: string;
}) => `@member_action=${action}@conversation_id=${conversationId}@receiver_id=${receiverId}`;

export default generateMemberActionChannel;
