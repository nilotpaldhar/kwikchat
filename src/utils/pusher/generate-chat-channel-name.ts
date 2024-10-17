/**
 * Generates a channel name for a private conversation.
 * The channel name is constructed with the conversation type, ID, and receiver ID.
 */
const generatePrivateChatChannelName = ({
	conversationId,
	receiverId,
}: {
	conversationId: string;
	receiverId: string;
}) => {
	const conversationType = "private";
	return `@conversation_type=${conversationType}@conversation_id=${conversationId}@receiver_id=${receiverId}`;
};

// eslint-disable-next-line import/prefer-default-export
export { generatePrivateChatChannelName };
