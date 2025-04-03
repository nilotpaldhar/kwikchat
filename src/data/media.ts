import "server-only";

import type { Prisma, FileType, Media } from "@prisma/client";
import { ChatAttachmentTypes, type PaginatedResponse } from "@/types";

import { prisma } from "@/lib/db";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constants/pagination";
import { calculatePagination } from "@/utils/general/calculate-pagination";

interface GetConversationMediaParams {
	conversationId: string;
	page?: number;
	pageSize?: number;
	mediaType: FileType | null;
}

/**
 * Fetches conversation media from the database with pagination and optional filtering by media type.
 */
const getConversationMediaFromDB = async ({
	conversationId,
	page = DEFAULT_PAGE,
	pageSize = DEFAULT_PAGE_SIZE,
	mediaType,
}: GetConversationMediaParams) => {
	// Calculate the offset for pagination
	const skip = (page - 1) * pageSize;
	const take = pageSize;

	// Base where clause to filter media
	const baseWhereClause: Prisma.MediaWhereInput = {
		...(mediaType && { fileType: mediaType }),
		OR: [
			{ imageMessage: { message: { conversationId } } },
			{ documentMessage: { message: { conversationId } } },
		],
	};

	try {
		const [mediaList, totalItems] = await Promise.all([
			prisma.media.findMany({ skip, take, where: baseWhereClause, orderBy: { createdAt: "desc" } }),
			prisma.media.count({ where: baseWhereClause }),
		]);

		return { mediaList, totalItems };
	} catch (error) {
		return { mediaList: [], totalItems: 0 };
	}
};

/**
 * Retrieves conversation media and constructs a paginated response.
 */
const getConversationMedia = async ({
	conversationId,
	page,
	pageSize,
	mediaType,
}: GetConversationMediaParams): Promise<PaginatedResponse<Media>> => {
	const { mediaList, totalItems } = await getConversationMediaFromDB({
		conversationId,
		page,
		pageSize,
		mediaType,
	});
	const paginationMetadata = calculatePagination({ page, pageSize, totalItems });

	return {
		pagination: paginationMetadata,
		items: mediaList,
	};
};

/**
 * Fetches media attachments from a message based on the specified attachment type.
 */
const getMediaFromMessage = async ({
	messageId,
	attachmentType,
}: {
	messageId: string;
	attachmentType: ChatAttachmentTypes;
}): Promise<Media[]> => {
	let mediaAttachments: Media[] = [];

	try {
		// Fetch document attachments if the type is Document
		if (attachmentType === ChatAttachmentTypes.Document) {
			const documentMessage = await prisma.documentMessage.findUnique({
				where: { messageId },
				include: { media: true },
			});

			// Ensure we return a consistent array format
			if (documentMessage?.media) {
				mediaAttachments = [documentMessage.media];
			}
		}

		// Fetch image attachments if the type is Image
		if (attachmentType === ChatAttachmentTypes.Image) {
			const imageMessages = await prisma.imageMessage.findMany({
				where: { messageId },
				include: { media: true },
			});

			// Flatten array since media is likely an object inside each message
			mediaAttachments = imageMessages.flatMap((imgMsg) => imgMsg.media);
		}

		return mediaAttachments;
	} catch (error) {
		return mediaAttachments;
	}
};

export { getConversationMedia, getMediaFromMessage };
