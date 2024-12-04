import "server-only";

import type { GroupMember, PaginatedResponse } from "@/types";

import { prisma } from "@/lib/db";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constants/pagination";
import { calculatePagination } from "@/utils/general/calculate-pagination";

interface GetGroupMembersParams {
	conversationId: string;
	page?: number;
	pageSize?: number;
}

/**
 * Retrieves membership details for a specific user in a group conversation.
 */
const getMembershipDetails = async ({
	conversationId,
	userId,
}: {
	conversationId: string;
	userId: string;
}): Promise<GroupMember | null> => {
	try {
		const member = await prisma.member.findFirst({
			where: { conversationId, userId },
			include: { user: { omit: { password: true } } },
		});

		return member;
	} catch (error) {
		return null;
	}
};

/**
 * Fetches a paginated list of group members from the database for a given conversation.
 */
const getGroupMembersFromDB = async ({
	conversationId,
	page = DEFAULT_PAGE,
	pageSize = DEFAULT_PAGE_SIZE,
}: GetGroupMembersParams) => {
	// Calculate the offset for pagination
	const skip = (page - 1) * pageSize;
	const take = pageSize;

	try {
		// Perform database queries in parallel for better performance
		const [memberList, totalItems] = await Promise.all([
			// Fetch a paginated list of members
			prisma.member.findMany({
				where: { conversationId },
				include: { user: { omit: { password: true } } },
				skip,
				take,
				orderBy: { user: { username: "asc" } },
			}),

			// Fetch the total count of members for the given conversation
			prisma.member.count({
				where: { conversationId },
			}),
		]);

		return { memberList, totalItems };
	} catch (error) {
		return { memberList: [], totalItems: 0 };
	}
};

/**
 * Retrieves group members with pagination metadata.
 */
const getGroupMembers = async ({
	conversationId,
	page = DEFAULT_PAGE,
	pageSize = DEFAULT_PAGE_SIZE,
}: GetGroupMembersParams): Promise<PaginatedResponse<GroupMember>> => {
	// Fetch the group members and the total count from the database
	const { memberList, totalItems } = await getGroupMembersFromDB({
		conversationId,
		page,
		pageSize,
	});

	// Calculate pagination metadata based on the total items and current page
	const paginationMetadata = calculatePagination({ page, pageSize, totalItems });

	return { pagination: paginationMetadata, items: memberList };
};

export { getMembershipDetails, getGroupMembers };
