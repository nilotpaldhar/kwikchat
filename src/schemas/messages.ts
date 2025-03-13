import * as z from "zod";
import { MessageType, MessageReactionType } from "@prisma/client";
import { formatFileSize } from "@/utils/general/file";

import {
	MAX_IMAGE_SELECTION_LIMIT,
	MAX_MESSAGE_CAPTION_CHAR_LENGTH,
	MAX_MESSAGE_CHAR_LENGTH,
	SUPPORTED_DOCUMENT_FILE_MESSAGE_TYPES,
	SUPPORTED_IMAGE_FILE_MESSAGE_TYPES,
} from "@/constants/chat-input";
import { MAX_CHAT_DOCUMENT_FILE_SIZE, MAX_CHAT_IMAGE_FILE_SIZE } from "@/constants/media";

export const DocumentFileSizeSchema = z.object({
	raw: z.number().max(
		MAX_CHAT_DOCUMENT_FILE_SIZE,
		`Document size cannot exceed ${formatFileSize(MAX_CHAT_DOCUMENT_FILE_SIZE)}` // Max 10MB
	),
	formatted: z.string(),
});

export const ImageFileSizeSchema = z.object({
	raw: z.number().max(
		MAX_CHAT_IMAGE_FILE_SIZE,
		`Image size cannot exceed ${formatFileSize(MAX_CHAT_DOCUMENT_FILE_SIZE)}` // Max 10MB
	),
	formatted: z.string(),
});

export const TextMessageSchema = z.object({
	message: z
		.string()
		.trim()
		.min(1, { message: "Message content cannot be empty." })
		.max(
			MAX_MESSAGE_CHAR_LENGTH,
			`Your message is too long (over ${MAX_MESSAGE_CHAR_LENGTH} characters). Please shorten it and try again.`
		),
});

export const MessageCaptionSchema = z.object({
	caption: z
		.string()
		.max(
			MAX_MESSAGE_CAPTION_CHAR_LENGTH,
			`Caption too long. Please keep it under ${MAX_MESSAGE_CAPTION_CHAR_LENGTH} characters.`
		)
		.optional(),
});

export const DocumentMessageSchema = z.object({
	caption: MessageCaptionSchema.shape.caption,
	document: z.object({
		fileType: z.enum(SUPPORTED_DOCUMENT_FILE_MESSAGE_TYPES, {
			message: `The selected file type is not allowed. Please upload a supported document format: ${SUPPORTED_DOCUMENT_FILE_MESSAGE_TYPES.join(", ")}.`,
		}),
		fileSize: DocumentFileSizeSchema,
		fileName: z.string(),
	}),
	documentDataUrl: z.string().min(1, "Document data URL is required"),
});

export const ImageMessageSchema = z.object({
	caption: MessageCaptionSchema.shape.caption,
	image: z.object({
		fileName: z.string(),
		fileType: z.enum(SUPPORTED_IMAGE_FILE_MESSAGE_TYPES, {
			message: `The selected file type is not allowed. Please upload a supported image format: ${SUPPORTED_IMAGE_FILE_MESSAGE_TYPES.join(", ")}.`,
		}),
		fileSize: ImageFileSizeSchema,
	}),
	imageDataUrl: z.string().min(1, "Image data URL is required"),
});

export const MessagePayloadSchema = z.discriminatedUnion("messageType", [
	z.object({
		messageType: z.literal(MessageType.text),
		message: TextMessageSchema.shape.message,
	}),
	z.object({
		messageType: z.literal(MessageType.document),
		message: DocumentMessageSchema,
	}),
	z.object({
		messageType: z.literal(MessageType.image),
		message: z
			.array(ImageMessageSchema)
			.max(
				MAX_IMAGE_SELECTION_LIMIT,
				`You can upload a maximum of ${MAX_IMAGE_SELECTION_LIMIT} images`
			),
	}),
]);

export const SeenMessageSchema = z.object({
	messageIds: z.array(z.string()),
});

export const MessageReactionSchema = z.object({
	reactionType: z.nativeEnum(MessageReactionType),
	emoji: z.string().emoji().min(1, "Emoji is required"),
	emojiImageUrl: z.string().url("Emoji image URL is not valid "),
});
