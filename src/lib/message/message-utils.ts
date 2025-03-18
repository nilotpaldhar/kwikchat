/**
 * This file contains utility functions for managing messages,
 * such as updating the "seen" status and deleting messages.
 */

import "server-only";

import type { MessageSeenMembers } from "@/types";
import { prisma } from "@/lib/db";

export enum DeleteMessageError {
	MessageNotFound = "MessageNotFound",
	MessageAlreadyDeleted = "MessageAlreadyDeleted",
	UserNotAuthorized = "UserNotAuthorized",
	UnknownError = "UnknownError",
}

export interface DeleteMessageResponse {
	messageId: string | null;
	error: DeleteMessageError | null;
}

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

/**
 * Deletes a message in a conversation based on the user's action.
 *
 * If `deleteForEveryone` is true, the message is marked as deleted for all users.
 * Otherwise, it is deleted only for the requesting user.
 */
const deleteMessage = async ({
	conversationId,
	messageId,
	userId,
	deleteForEveryone = false,
}: {
	conversationId: string;
	messageId: string;
	userId: string;
	deleteForEveryone?: boolean;
}): Promise<DeleteMessageResponse> => {
	try {
		// Find the message in the specified conversation that the user is a member of.
		const message = await prisma.message.findFirst({
			where: {
				id: messageId,
				conversationId,
				conversation: {
					members: { some: { userId } }, // Ensure the user is a member of the conversation.
				},
			},
		});

		// If the message doesn't exist or the user is not authorized, return an error.
		if (!message) {
			return {
				messageId: null,
				error: DeleteMessageError.MessageNotFound,
			};
		}

		// Handle the case where the message should be deleted for everyone in the conversation.
		if (deleteForEveryone) {
			// Check if the message is already deleted for everyone.
			if (message.isDeleted) {
				return {
					messageId: null,
					error: DeleteMessageError.MessageAlreadyDeleted,
				};
			}

			// Ensure that only the sender of the message can delete it for everyone.
			if (message.senderId !== userId) {
				return {
					messageId: null,
					error: DeleteMessageError.UserNotAuthorized,
				};
			}

			// Mark the message as deleted for everyone and clean up related data.
			await prisma.$transaction([
				// Mark the message as deleted and update its type.
				prisma.message.update({
					where: { id: message.id },
					data: { isDeleted: true, type: "deleted" },
				}),

				// Remove all reactions to the deleted message.
				prisma.messageReaction.deleteMany({
					where: { messageId: message.id },
				}),

				// Delete the text content of the message.
				prisma.textMessage.deleteMany({
					where: { messageId: message.id },
				}),

				// Delete the image content of the message.
				prisma.imageMessage.deleteMany({
					where: { messageId: message.id },
				}),

				// Delete the document content of the message.
				prisma.documentMessage.deleteMany({
					where: { messageId: message.id },
				}),

				// Remove the message from the user's starred messages.
				prisma.starredMessage.deleteMany({
					where: { messageId: message.id, userId },
				}),
			]);
		} else {
			// Handle the case where the message is deleted only for the requesting user.
			const existingDeletion = await prisma.deletedMessage.findUnique({
				where: { messageId_userId: { messageId, userId } },
			});

			// If the message is already marked as deleted for the user, return an error.
			if (existingDeletion) {
				return {
					messageId: null,
					error: DeleteMessageError.MessageAlreadyDeleted,
				};
			}

			// Mark the message as deleted for the specific user and remove it from their starred messages.
			await prisma.$transaction([
				prisma.deletedMessage.create({
					data: { messageId: message.id, userId },
				}),
				prisma.starredMessage.deleteMany({
					where: { messageId: message.id, userId },
				}),
			]);
		}

		return { messageId: message.id, error: null };
	} catch (error) {
		return {
			messageId: null,
			error: DeleteMessageError.UnknownError,
		};
	}
};

export { updateMessageSeenStatus, deleteMessage };
