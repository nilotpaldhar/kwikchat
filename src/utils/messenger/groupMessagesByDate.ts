import type { CompleteMessage } from "@/types";

import formatDateBasedOnRecency from "@/utils/general/format-date-based-on-recency";

interface GroupedMessages {
	date: string;
	messages: CompleteMessage[];
}

const groupMessagesByDate = (messages: CompleteMessage[]): GroupedMessages[] =>
	messages.reduce((acc: GroupedMessages[], message: CompleteMessage) => {
		const messageDate = formatDateBasedOnRecency(new Date(message.createdAt), false);
		const existingGroup = acc.find((group) => group.date === messageDate);

		if (existingGroup) {
			existingGroup.messages.push(message);
		} else {
			acc.push({ date: messageDate, messages: [message] });
		}

		return acc;
	}, []);

export default groupMessagesByDate;
