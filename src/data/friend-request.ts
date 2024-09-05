import "server-only";

import { Prisma } from "@prisma/client";

import type { PaginatedResponse, FriendRequestWithRequestType } from "@/types";

import { prisma } from "@/lib/db";
import { calculatePagination } from "@/utils/general/calculate-pagination";
import { classifyFriendRequest } from "@/lib/friend-request";

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constants/pagination";

interface Params {
	userId: string;
	page?: number;
	pageSize?: number;
	query?: string;
}

/**
 * Fetches friend requests from the database for a specific user with pagination.
 */
const getFriendRequestsFromDB = async ({
	userId,
	page = DEFAULT_PAGE,
	pageSize = DEFAULT_PAGE_SIZE,
	query = "",
}: Params) => {
	// Calculate the offset for pagination
	const skip = (page - 1) * pageSize;
	const take = pageSize;

	// Base where clause to filter block users
	const baseWhereClause: Prisma.FriendRequestWhereInput = {
		status: "pending",
		OR: [
			{
				senderId: userId,
				receiver: {
					OR: [
						{ name: { contains: query, mode: "insensitive" } },
						{ email: { contains: query, mode: "insensitive" } },
						{ username: { contains: query, mode: "insensitive" } },
					],
				},
			},
			{
				receiverId: userId,
				sender: {
					OR: [
						{ name: { contains: query, mode: "insensitive" } },
						{ email: { contains: query, mode: "insensitive" } },
						{ username: { contains: query, mode: "insensitive" } },
					],
				},
			},
		],
	};

	try {
		// Fetch friend requests and total count from the database
		const [friendRequestList, totalItems] = await Promise.all([
			prisma.friendRequest.findMany({
				where: baseWhereClause,
				include: {
					sender: { omit: { password: true } },
					receiver: { omit: { password: true } },
				},
				skip,
				take,
				orderBy: { createdAt: "desc" },
			}),
			prisma.friendRequest.count({
				where: baseWhereClause,
			}),
		]);

		return { friendRequestList, totalItems };
	} catch (error) {
		return { friendRequestList: [], totalItems: 0 };
	}
};

/**
 * Fetches and classifies friend requests for a specific user with pagination.
 */
const getFriendRequests = async ({
	userId,
	page = DEFAULT_PAGE,
	pageSize = DEFAULT_PAGE_SIZE,
	query = "",
}: Params): Promise<PaginatedResponse<FriendRequestWithRequestType>> => {
	const { friendRequestList, totalItems } = await getFriendRequestsFromDB({
		userId,
		page,
		pageSize,
		query,
	});
	const paginationMetadata = calculatePagination({ page, pageSize, totalItems });
	return {
		pagination: paginationMetadata,
		items: friendRequestList.map((item) =>
			classifyFriendRequest({
				userId,
				friendRequest: item,
			})
		),
	};
};

export { getFriendRequestsFromDB, getFriendRequests };
