import "server-only";

import { Prisma } from "@prisma/client";

import type { PaginatedResponse, FriendWithFriendship } from "@/types";

import { subMonths } from "date-fns";

import { prisma } from "@/lib/db";
import { removeDuplicateFriends } from "@/lib/friendship";
import { calculatePagination } from "@/utils/general/calculate-pagination";

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constants/pagination";

// Define the parameters for fetching friends
interface Params {
	userId: string;
	page?: number;
	pageSize?: number;
	query?: string;
	isOnline?: boolean;
	isRecent?: boolean;
}

/**
 * Retrieves friends from the database with pagination.
 */
const getFriendsFromDB = async ({
	userId,
	page = DEFAULT_PAGE,
	pageSize = DEFAULT_PAGE_SIZE,
	query = "",
	isOnline = false,
	isRecent = false,
}: Params) => {
	// Calculate the offset for pagination
	const skip = (page - 1) * (pageSize * 2);
	const take = pageSize * 2;

	// Calculate the date 3 months ago
	const threeMonthsAgo = subMonths(new Date(), 3);

	// Base where clause to filter friendships
	const baseWhereClause: Prisma.FriendshipWhereInput = {
		AND: [
			// Conditionally include the createdAt filter if `isRecent` is true
			...(isRecent ? [{ createdAt: { gt: threeMonthsAgo } }] : []),
			{
				OR: [
					// Filter friendships where the userId matches and apply additional filters
					{
						userId: userId,
						friend: {
							isOnline: isOnline || undefined, // Apply the isOnline filter if provided
							OR: [
								{ displayName: { contains: query, mode: "insensitive" } },
								{ username: { contains: query, mode: "insensitive" } },
								{ email: { contains: query, mode: "insensitive" } },
							],
						},
					},
					// Filter friendships where the friendId matches and apply additional filters
					{
						friendId: userId,
						user: {
							isOnline: isOnline || undefined, // Apply the isOnline filter if provided
							OR: [
								{ displayName: { contains: query, mode: "insensitive" } },
								{ username: { contains: query, mode: "insensitive" } },
								{ email: { contains: query, mode: "insensitive" } },
							],
						},
					},
				],
			},
		],
	};

	try {
		// Fetch friendships and count total items concurrently
		const [friendships, totalItems] = await Promise.all([
			prisma.friendship.findMany({
				where: baseWhereClause,
				include: {
					user: { omit: { password: true } },
					friend: { omit: { password: true } },
				},
				skip,
				take,
				orderBy: { createdAt: "desc" },
			}),
			prisma.friendship.count({ where: baseWhereClause }),
		]);

		// Process the results to include the other user in each friendship
		const friendList = friendships.map((friendship) => {
			const { friend, user, ...friendshipDetails } = friendship;
			const otherUser = friendship.userId === userId ? friend : user;
			return { ...otherUser, friendship: { ...friendshipDetails } };
		});

		// Remove duplicate friends from the list
		const uniqueFriendList = removeDuplicateFriends(friendList);

		// Return the unique friend list and the total item count (adjusted for pagination)
		return { friendList: uniqueFriendList, totalItems: Math.ceil(totalItems / 2) };
	} catch (error) {
		return { friendList: [], totalItems: 0 };
	}
};

/**
 * Retrieves a paginated list of friends based on the provided user ID.
 */
const getFriends = async ({
	userId,
	page = DEFAULT_PAGE,
	pageSize = DEFAULT_PAGE_SIZE,
	query = "",
	isOnline = false,
	isRecent = false,
}: Params): Promise<PaginatedResponse<FriendWithFriendship>> => {
	const { friendList, totalItems } = await getFriendsFromDB({
		userId,
		page,
		pageSize,
		query,
		isOnline,
		isRecent,
	});
	const paginationMetadata = calculatePagination({ page, pageSize, totalItems });
	return {
		pagination: paginationMetadata,
		items: friendList,
	};
};

export { getFriendsFromDB, getFriends };
