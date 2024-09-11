import "server-only";

import { Prisma } from "@prisma/client";

import type { PaginatedResponse, BlockedUser } from "@/types";

import { prisma } from "@/lib/db";
import { calculatePagination } from "@/utils/general/calculate-pagination";

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constants/pagination";

interface Params {
	blockerId: string;
	page?: number;
	pageSize?: number;
	query?: string;
}

/**
 * Retrieves blocked users from the database with pagination.
 */
const getBlockedUsersFromDB = async ({
	blockerId,
	page = DEFAULT_PAGE,
	pageSize = DEFAULT_PAGE_SIZE,
	query = "",
}: Params) => {
	// Calculate the offset for pagination
	const skip = (page - 1) * pageSize;
	const take = pageSize;

	// Base where clause to filter block users
	const baseWhereClause: Prisma.BlockWhereInput = {
		blockerId,
		blocked: {
			OR: [
				{ displayName: { contains: query, mode: "insensitive" } },
				{ username: { contains: query, mode: "insensitive" } },
				{ email: { contains: query, mode: "insensitive" } },
			],
		},
	};

	try {
		const [blockedList, totalItems] = await Promise.all([
			prisma.block.findMany({
				where: baseWhereClause,
				include: { blocked: { omit: { password: true } } },
				skip,
				take,
				orderBy: { createdAt: "desc" },
			}),
			prisma.block.count({ where: baseWhereClause }),
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
	query = "",
}: Params): Promise<PaginatedResponse<BlockedUser>> => {
	const { blockedList, totalItems } = await getBlockedUsersFromDB({
		blockerId,
		page,
		pageSize,
		query,
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
