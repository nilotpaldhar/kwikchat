export type ConversationLifecycle = "created" | "updated" | "updated_unread_count";

/**
 * Generates a channel name for conversation lifecycle events such as creation or updates.
 */
const generateConversationLifecycleChannel = ({
	receiverId,
	lifecycle,
}: {
	receiverId: string;
	lifecycle: ConversationLifecycle;
}) => `@conversation=${lifecycle}@receiver_id=${receiverId}`;

export default generateConversationLifecycleChannel;
