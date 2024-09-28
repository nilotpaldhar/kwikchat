import "server-only";

import type { PaginatedResponse, CompleteMessage } from "@/types";

import { prisma } from "@/lib/db";
import { calculatePagination } from "@/utils/general/calculate-pagination";

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constants/pagination";

interface Params {
	conversationId: string;
	page?: number;
	pageSize?: number;
}

/**
 * Fetches messages from the database with pagination.
 */
const getMessagesFromDB = async ({
	conversationId,
	page = DEFAULT_PAGE,
	pageSize = DEFAULT_PAGE_SIZE,
}: Params) => {
	// Calculate the offset for pagination
	const skip = (page - 1) * pageSize;
	const take = pageSize;

	try {
		// Fetch messages and total count from the database
		const [messageList, totalItems] = await Promise.all([
			prisma.message.findMany({
				where: { conversationId },
				include: { textMessage: true, imageMessage: true },
				skip,
				take,
				orderBy: { createdAt: "desc" },
			}),
			prisma.message.count({
				where: { conversationId },
			}),
		]);

		return { messageList, totalItems };
	} catch (error) {
		return { messageList: [], totalItems: 0 };
	}
};

/**
 * Fetches messages with pagination.
 */
const getMessages = async ({
	conversationId,
	page = DEFAULT_PAGE,
	pageSize = DEFAULT_PAGE_SIZE,
}: Params): Promise<PaginatedResponse<CompleteMessage>> => {
	const { messageList, totalItems } = await getMessagesFromDB({ conversationId, page, pageSize });
	const paginationMetadata = calculatePagination({ page, pageSize, totalItems });

	return {
		pagination: paginationMetadata,
		items: messageList,
	};
};

export { getMessagesFromDB, getMessages };
