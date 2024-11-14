/**
 * Generates a pusher channel name for conversation.
 * The channel name is constructed with the conversation type, ID, and receiver ID.
 */
const generateChatChannelName = ({
	conversationId,
	conversationType = "private",
	receiverId,
}: {
	conversationId: string;
	conversationType?: "private" | "group";
	receiverId: string;
}) =>
	`@conversation_type=${conversationType}@conversation_id=${conversationId}@receiver_id=${receiverId}`;

export default generateChatChannelName;
