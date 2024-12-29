/**
 * Generates a unique channel name for real-time messaging in a chat application.
 */
const generateChatMessagingChannel = ({
	conversationId,
	conversationType = "private",
	receiverId,
}: {
	conversationId: string;
	conversationType?: "private" | "group";
	receiverId: string;
}) =>
	`@conversation_type=${conversationType}@conversation_id=${conversationId}@receiver_id=${receiverId}`;

export default generateChatMessagingChannel;
