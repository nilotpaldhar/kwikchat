import type { CompleteMessage } from "@/types";

import formatDateBasedOnRecency from "@/utils/general/format-date-based-on-recency";

interface GroupedMessages {
	date: string;
	messages: CompleteMessage[];
}

/**
 * Groups an array of messages by the date they were created, using a formatted date string.
 * Each group contains a `date` (formatted as either "today", "yesterday", day of the week, or a date)
 * and an array of messages sent on that day.
 */
const groupMessagesByDate = (messages: CompleteMessage[]): GroupedMessages[] =>
	// Use the `reduce` function to iterate through all messages and group them by formatted date.
	messages.reduce((acc: GroupedMessages[], message: CompleteMessage) => {
		// Format the message's `createdAt` timestamp to a human-readable string (e.g., "today", "yesterday", or specific date)
		const messageDate = formatDateBasedOnRecency(new Date(message.createdAt), false);

		// Check if there's already a group for this date in the accumulator
		const existingGroup = acc.find((group) => group.date === messageDate);

		if (existingGroup) {
			existingGroup.messages.push(message);
		} else {
			acc.push({ date: messageDate, messages: [message] });
		}

		return acc;
	}, []);

export default groupMessagesByDate;
