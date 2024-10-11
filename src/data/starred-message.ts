import "server-only";

import type { PaginatedResponse, CompleteMessage } from "@/types";

import { prisma } from "@/lib/db";
import { MESSAGE_INCLUDE } from "@/data/message";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constants/pagination";

import { calculatePagination } from "@/utils/general/calculate-pagination";
import transformMessageSeenAndStarStatus from "@/utils/messenger/transform-message-seen-and-star-status";

interface GetStarredMessagesParams {
	conversationId: string;
	userId: string;
	page?: number;
	pageSize?: number;
}

/**
 * Fetches starred messages from the database with pagination.
 */
const getStarredMessagesFromDB = async ({
	conversationId,
	userId,
	page = DEFAULT_PAGE,
	pageSize = DEFAULT_PAGE_SIZE,
}: GetStarredMessagesParams) => {
	// Calculate the offset for pagination
	const skip = (page - 1) * pageSize;
	const take = pageSize;

	try {
		// Fetch messages and total count from the database
		const [starredMessageList, totalItems] = await Promise.all([
			prisma.starredMessage.findMany({
				where: { userId, message: { conversationId } },
				include: {
					message: {
						include: MESSAGE_INCLUDE,
					},
				},
				skip,
				take,
				orderBy: { starredAt: "asc" },
			}),
			prisma.starredMessage.count({
				where: { userId, message: { conversationId } },
			}),
		]);

		return {
			starredMessageList: starredMessageList.map((starredMessage) =>
				transformMessageSeenAndStarStatus({ message: starredMessage.message, userId })
			),
			totalItems,
		};
	} catch (error) {
		return { starredMessageList: [], totalItems: 0 };
	}
};

/**
 * Fetches starred messages with pagination.
 */
const getStarredMessages = async ({
	conversationId,
	userId,
	page = DEFAULT_PAGE,
	pageSize = DEFAULT_PAGE_SIZE,
}: GetStarredMessagesParams): Promise<PaginatedResponse<CompleteMessage>> => {
	const { starredMessageList, totalItems } = await getStarredMessagesFromDB({
		conversationId,
		userId,
		page,
		pageSize,
	});
	const paginationMetadata = calculatePagination({ page, pageSize, totalItems });

	return {
		pagination: paginationMetadata,
		items: starredMessageList,
	};
};

export { getStarredMessagesFromDB, getStarredMessages };
