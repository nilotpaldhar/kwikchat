import "server-only";

import type { PaginatedResponse, FriendRequestWithRequestType } from "@/types";

import { prisma } from "@/lib/db";
import { calculatePagination } from "@/utils/general/calculate-pagination";
import { classifyFriendRequest } from "@/lib/friend-request";

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constants/pagination";

interface Params {
	userId: string;
	page?: number;
	pageSize?: number;
}

const getFriendRequestsFromDB = async ({
	userId,
	page = DEFAULT_PAGE,
	pageSize = DEFAULT_PAGE_SIZE,
}: Params) => {
	const skip = (page - 1) * pageSize;
	const take = pageSize;

	try {
		const [friendRequestList, totalItems] = await Promise.all([
			prisma.friendRequest.findMany({
				where: {
					status: "pending",
					OR: [{ senderId: userId }, { receiverId: userId }],
				},
				include: {
					sender: { omit: { password: true } },
					receiver: { omit: { password: true } },
				},
				skip,
				take,
				orderBy: { createdAt: "desc" },
			}),
			prisma.friendRequest.count({
				where: {
					status: "pending",
					OR: [{ senderId: userId }, { receiverId: userId }],
				},
			}),
		]);

		return { friendRequestList, totalItems };
	} catch (error) {
		return { friendRequestList: [], totalItems: 0 };
	}
};

const getFriendRequests = async ({
	userId,
	page = DEFAULT_PAGE,
	pageSize = DEFAULT_PAGE_SIZE,
}: Params): Promise<PaginatedResponse<FriendRequestWithRequestType>> => {
	const { friendRequestList, totalItems } = await getFriendRequestsFromDB({
		userId,
		page,
		pageSize,
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
