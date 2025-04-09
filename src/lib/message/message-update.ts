import "server-only";

import type { MessageSeenMembers } from "@/types";

import { prisma } from "@/lib/db";

/**
 * Updates the seen status for a list of message IDs by a given member.
 * This function upserts (inserts or updates) the seen status in the database
 * and returns a list of messages with the IDs and users who have seen them.
 */
const updateMessageSeenStatus = async ({
	messageIds,
	memberId,
}: {
	messageIds: string[];
	memberId: string;
}) => {
	try {
		// Perform a transaction to upsert the seen status for each message
		const seenStatusUpdates = await prisma.$transaction(
			messageIds.map((messageId) =>
				prisma.messageSeenStatus.upsert({
					where: {
						messageId_memberId: { messageId, memberId },
					},
					update: { seenAt: new Date() },
					create: { messageId, memberId, seenAt: new Date() },
					include: { member: { select: { userId: true } } },
				})
			)
		);

		// Aggregate the seen status by messageId and members who have seen it
		const aggregatedSeenStatus = seenStatusUpdates.reduce((acc: MessageSeenMembers[], status) => {
			const { messageId, member } = status;
			const existingMessage = acc.find((item) => item.messageId === messageId);

			if (existingMessage) {
				existingMessage.seenByMembers.push(member.userId);
			} else {
				acc.push({ messageId, seenByMembers: [member.userId] });
			}

			return acc;
		}, []);

		return aggregatedSeenStatus;
	} catch (error) {
		return [];
	}
};

export { updateMessageSeenStatus };
