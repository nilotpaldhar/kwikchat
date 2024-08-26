import "server-only";

import type { PaginatedResponse, BlockedUser } from "@/types";

import { prisma } from "@/lib/db";
import { calculatePagination } from "@/utils/general/calculate-pagination";

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constants/pagination";

interface Params {
	blockerId: string;
	page?: number;
	pageSize?: number;
}

/**
 * Retrieves blocked users from the database with pagination.
 */
const getBlockedUsersFromDB = async ({
	blockerId,
	page = DEFAULT_PAGE,
	pageSize = DEFAULT_PAGE_SIZE,
}: Params) => {
	const skip = (page - 1) * pageSize;
	const take = pageSize;

	try {
		const [blockedList, totalItems] = await Promise.all([
			prisma.block.findMany({
				where: { blockerId },
				include: { blocked: { omit: { password: true } } },
				skip,
				take,
				orderBy: { createdAt: "desc" },
			}),
			prisma.block.count({ where: { blockerId } }),
		]);

		return { blockedList, totalItems };
	} catch (error) {
		return { blockedList: [], totalItems: 0 };
	}
};

/**
 * Retrieves a paginated list of blocked users based on the provided blocker ID.
 */
const getBlockedUsers = async ({
	blockerId,
	page = DEFAULT_PAGE,
	pageSize = DEFAULT_PAGE_SIZE,
}: Params): Promise<PaginatedResponse<BlockedUser>> => {
	const { blockedList, totalItems } = await getBlockedUsersFromDB({
		blockerId,
		page,
		pageSize,
	});
	const paginationMetadata = calculatePagination({ page, pageSize, totalItems });
	return {
		pagination: paginationMetadata,
		items: blockedList.map((item) => ({
			user: item.blocked,
			blockedAt: item.createdAt,
		})),
	};
};

export { getBlockedUsersFromDB, getBlockedUsers };
