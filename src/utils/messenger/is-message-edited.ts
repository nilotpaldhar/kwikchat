import type { CompleteMessage } from "@/types";

/**
 * Checks if a message has been edited by comparing its `createdAt` and `updatedAt` timestamps.
 */
const isMessageEdited = (message: CompleteMessage) => {
	const { type, textMessage, imageMessage } = message;

	// Helper function to compare the `createdAt` and `updatedAt` timestamps
	// Returns true if both timestamps are equal (i.e., the message has not been edited)
	const compareTimestamps = (createdAt: Date, updatedAt: Date) =>
		new Date(createdAt).getTime() === new Date(updatedAt).getTime();

	// Check if the message is a text message and perform the timestamp comparison
	if (type === "text" && textMessage) {
		return !compareTimestamps(textMessage.created_at, textMessage.updated_at);
	}

	// Check if the message is an image message and perform the timestamp comparison
	if (type === "image" && imageMessage) {
		return !compareTimestamps(imageMessage.created_at, imageMessage.updated_at);
	}

	return false;
};

export default isMessageEdited;
