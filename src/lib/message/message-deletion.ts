import "server-only";

import { MessageType } from "@prisma/client";

import { prisma } from "@/lib/db";
import { deleteImageOrFile } from "@/lib/upload";

export enum DeleteMessageError {
	MessageNotFound = "MessageNotFound",
	MessageAlreadyDeleted = "MessageAlreadyDeleted",
	UserNotAuthorized = "UserNotAuthorized",
	ContentDeletionFailed = "ContentDeletionFailed",
	UnknownError = "UnknownError",
}

export interface DeleteMessageResponse {
	messageId: string | null;
	error: DeleteMessageError | null;
}

/**
 * Deletes multiple image files from an external service (e.g., ImageKit).
 */
const deleteImageFiles = async ({ fileIds }: { fileIds: string[] }) => {
	await Promise.all(fileIds.map((fileId) => deleteImageOrFile({ fileId })));
};

/**
 * Deletes a text message from the database.
 */
const deleteTextMessage = async ({ messageId }: { messageId: string }): Promise<boolean> => {
	await prisma.textMessage.delete({ where: { messageId } });
	return true;
};

/**
 * Deletes a document message and its associated media.
 */
const deleteDocumentMessage = async ({ messageId }: { messageId: string }): Promise<boolean> => {
	// Find the document message by its ID.
	const documentMsg = await prisma.documentMessage.findUnique({ where: { messageId } });
	if (!documentMsg) return false;

	// Find the media associated with the document message.
	const documentMsgMedia = await prisma.media.findFirst({
		where: { documentMessage: { id: documentMsg.id } },
	});
	if (!documentMsgMedia) return false;

	// Delete the media file from the external service (e.g., ImageKit).
	await deleteImageOrFile({ fileId: documentMsgMedia.externalId });

	// Delete the document message and associated media in a single database transaction.
	await prisma.$transaction([
		prisma.documentMessage.delete({ where: { id: documentMsg.id } }),
		prisma.media.delete({ where: { id: documentMsgMedia.id } }),
	]);

	return true;
};

/**
 *  Deletes image messages and its associated media files.
 */
const deleteImageMessage = async ({ messageId }: { messageId: string }): Promise<boolean> => {
	// Find all image messages associated with the given messageId.
	const imageMessages = await prisma.imageMessage.findMany({
		where: { messageId },
		select: { id: true, mediaId: true },
	});
	if (imageMessages.length === 0) return false;

	// Extract media IDs from the found image messages.
	const imageMediaIds = imageMessages.map(({ mediaId }) => mediaId);

	// Fetch the media associated with the image messages.
	const imageMediaList = await prisma.media.findMany({
		where: { id: { in: imageMediaIds } },
		select: { id: true, externalId: true },
	});
	if (imageMediaList.length === 0) return false;

	// Delete the image files from the external service (e.g., ImageKit).
	await deleteImageFiles({ fileIds: imageMediaList.map(({ externalId }) => externalId) });

	// Delete the image messages and media from the database in a single transaction.
	await prisma.$transaction([
		prisma.imageMessage.deleteMany({ where: { messageId } }),
		prisma.media.deleteMany({ where: { id: { in: imageMediaIds } } }),
	]);

	return true;
};

/**
 *  Deletes message content based on its type (text, document, or image).
 */
const deleteMessageContent = async ({
	messageId,
	messageType,
}: {
	messageId: string;
	messageType: MessageType;
}): Promise<boolean> => {
	try {
		switch (messageType) {
			case MessageType.text: {
				return await deleteTextMessage({ messageId });
			}

			case MessageType.document: {
				return await deleteDocumentMessage({ messageId });
			}

			case MessageType.image: {
				return await deleteImageMessage({ messageId });
			}

			default: {
				return false;
			}
		}
	} catch (error) {
		return false;
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

			// Delete message content.
			const contentDeleted = await deleteMessageContent({
				messageId: message.id,
				messageType: message.type,
			});

			if (!contentDeleted) {
				return {
					messageId: null,
					error: DeleteMessageError.ContentDeletionFailed,
				};
			}

			// Clean up related data and mark the message as deleted.
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

export { deleteMessageContent, deleteMessage };
