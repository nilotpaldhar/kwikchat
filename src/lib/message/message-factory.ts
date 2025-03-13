/**
 * This file is responsible for creating different types of messages,
 * such as system, text, image, and document.
 */

import "server-only";

import { FileType, MessageType, type SystemMessageEvent } from "@prisma/client";
import {
	ChatAttachmentTypes,
	type ChatDocumentAttachment,
	type ChatImageAttachment,
	type CompleteMessage,
} from "@/types";

import { nanoid } from "nanoid";
import { prisma } from "@/lib/db";

import { MESSAGE_INCLUDE } from "@/data/message";
import { saveMedia } from "@/lib/media";
import { uploadAttachment } from "@/lib/upload";
import { updateConversationTimestamp } from "@/lib/conversation";

import transformMessageSeenAndStarStatus from "@/utils/messenger/transform-message-seen-and-star-status";

/**
 * Creates a text message and stores it in the database.
 */
const createTextMessage = async ({
	conversationId,
	userId,
	payload,
}: {
	conversationId: string;
	userId: string;
	payload: string;
}) => {
	try {
		// Insert new text message into the database
		const message = await prisma.message.create({
			data: {
				conversationId,
				senderId: userId,
				type: "text",
				textMessage: {
					create: { content: payload },
				},
			},
			include: MESSAGE_INCLUDE,
		});

		return message;
	} catch (error) {
		return null;
	}
};

/**
 * Creates and stores a document message in the database.
 */
const createDocumentMessage = async ({
	conversationId,
	userId,
	isGroup,
	payload,
}: {
	conversationId: string;
	userId: string;
	isGroup: boolean;
	payload: ChatDocumentAttachment;
}) => {
	// Validate required document data
	if (!payload.documentDataUrl) return null;

	// Upload document attachment
	const attachment = await uploadAttachment({
		attachmentUrl: payload.documentDataUrl,
		attachmentType: ChatAttachmentTypes.Document,
		attachmentName: payload.document.fileName,
		userId,
		isGroup,
		conversationId,
	});

	// Ensure the document was successfully uploaded
	if (!attachment) return null;

	try {
		// Save media details to the database
		const media = await saveMedia({
			data: {
				externalId: attachment.fileId,
				name: attachment.name,
				size: attachment.size,
				filePath: attachment.filePath,
				url: attachment.url,
				fileType: FileType.document,
				height: attachment.height,
				width: attachment.width,
				thumbnailUrl: attachment.thumbnailUrl,
				caption: payload.caption,
			},
		});

		// Ensure media was successfully saved
		if (!media.id) return null;

		// Create and store the document message
		const message = await prisma.message.create({
			data: {
				conversationId,
				senderId: userId,
				type: "document",
				documentMessage: {
					create: { mediaId: media.id },
				},
			},
			include: MESSAGE_INCLUDE,
		});

		return message;
	} catch (error) {
		return null;
	}
};

/**
 * Creates an image message by uploading multiple images, storing media data,
 * and linking them to a message in a database transaction.
 */
const createImageMessage = async ({
	conversationId,
	userId,
	isGroup,
	payload,
}: {
	conversationId: string;
	userId: string;
	isGroup: boolean;
	payload: ChatImageAttachment[];
}) => {
	try {
		// Upload all images in parallel and bail out on the first failure
		const uploadResults = await Promise.allSettled(
			payload.map(async (image) => {
				if (!image.imageDataUrl) return Promise.reject(new Error("Invalid image data"));

				const uploaded = await uploadAttachment({
					attachmentUrl: image.imageDataUrl,
					attachmentType: ChatAttachmentTypes.Image,
					attachmentName: image.image.fileName,
					userId,
					isGroup,
					conversationId,
				});

				return uploaded ? { ...uploaded, caption: image.caption } : null;
			})
		);

		const isFulfilled = <T>(result: PromiseSettledResult<T>): result is PromiseFulfilledResult<T> =>
			result.status === "fulfilled";

		// Type guard to filter only successful uploads
		const attachments = uploadResults
			.filter(isFulfilled)
			.map((uploadResult) => uploadResult.value)
			.filter((uploadResult) => uploadResult !== null);

		// Ensure at least one valid upload
		if (attachments.length === 0) return null;

		const result = await prisma.$transaction(
			async (tx) => {
				// Step 1: Create the message entry
				const createdMessage = await tx.message.create({
					data: {
						conversationId,
						senderId: userId,
						type: "image",
						imageMessage: { create: [] },
					},
				});
				if (!createdMessage) return null;

				// Step 2: Prepare media data from attachments
				const mediaData = attachments.map((attachment) => ({
					id: nanoid(),
					externalId: attachment.fileId,
					name: attachment.name,
					size: attachment.size,
					filePath: attachment.filePath,
					url: attachment.url,
					fileType: FileType.document,
					height: attachment.height,
					width: attachment.width,
					thumbnailUrl: attachment.thumbnailUrl,
					caption: attachment.caption,
				}));

				// Step 3: Insert media records in bulk
				await tx.media.createMany({ data: mediaData });

				// Step 4: Retrieve inserted media records (since createMany() does NOT return inserted items)
				const createdMedia = await tx.media.findMany({
					where: { id: { in: mediaData.map((m) => m.id) } },
				});
				if (!createdMedia.length) return null; // Ensure media was inserted successfully

				// Step 5: Create ImageMessage entries linking the message to the media
				await tx.imageMessage.createMany({
					data: createdMedia.map((media) => ({
						messageId: createdMessage.id,
						mediaId: media.id,
					})),
				});

				// Step 6: Retrieve the fully populated message
				const message = await tx.message.findUnique({
					where: { id: createdMessage.id },
					include: MESSAGE_INCLUDE,
				});

				return message;
			},
			{
				timeout: 60000, // 60 seconds
			}
		);

		return result;
	} catch (error) {
		return null;
	}
};

/**
 * Creates a system message associated with a conversation and user.
 */
const createSystemMessage = async ({
	conversationId,
	userId,
	event,
	content,
}: {
	conversationId: string;
	userId: string;
	event: SystemMessageEvent;
	content: string;
}): Promise<CompleteMessage | null> => {
	try {
		const message = await prisma.message.create({
			data: {
				conversationId,
				senderId: userId,
				type: "system",
				systemMessage: {
					create: { event, content },
				},
			},
			include: MESSAGE_INCLUDE,
		});

		// Update conversation timestamp
		await updateConversationTimestamp({ conversationId: message.conversationId });

		return transformMessageSeenAndStarStatus({ message: message, userId });
	} catch (error) {
		return null;
	}
};

// Type guard to check if payload is a document attachment
const isDocumentAttachment = (payload: unknown): payload is ChatDocumentAttachment =>
	typeof payload === "object" && payload !== null && "documentDataUrl" in payload;

// Type guard to check if payload is an array of image attachments
const isImageAttachment = (payload: unknown): payload is ChatImageAttachment[] =>
	Array.isArray(payload) &&
	payload.every(
		(item) =>
			typeof item === "object" &&
			item !== null &&
			"imageDataUrl" in item &&
			typeof item.imageDataUrl === "string"
	);

/**
 * Creates a new message based on the provided message type.
 *
 * Supports different message types including text, document, and image.
 * Calls the appropriate function to handle each message type.
 */
const createMessage = async ({
	messageType,
	payload,
	conversationId,
	userId,
	isGroup,
}: {
	messageType: MessageType;
	payload: string | ChatDocumentAttachment | ChatImageAttachment[];
	conversationId: string;
	userId: string;
	isGroup: boolean;
}) => {
	switch (messageType) {
		case MessageType.text: {
			if (typeof payload !== "string") {
				throw new Error("Invalid payload: Expected a string for text messages.");
			}
			return createTextMessage({ conversationId, payload, userId });
		}

		case MessageType.document: {
			if (!isDocumentAttachment(payload)) {
				throw new Error("Invalid payload: Expected a document attachment for document messages.");
			}
			return createDocumentMessage({ conversationId, payload, userId, isGroup });
		}

		case MessageType.image: {
			if (!isImageAttachment(payload)) {
				throw new Error("Invalid payload: Expected a image attachment for image messages.");
			}
			return createImageMessage({ conversationId, payload, userId, isGroup });
		}

		default:
			throw new Error(`Unsupported message type: ${messageType}`);
	}
};

export { createTextMessage, createDocumentMessage, createSystemMessage, createMessage };
