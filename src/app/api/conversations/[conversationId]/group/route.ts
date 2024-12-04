/* eslint-disable import/prefer-default-export */

import { type NextRequest, NextResponse } from "next/server";
import type { GroupOverview } from "@/types";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/data/auth/session";

type Params = { conversationId: string };

/**
 * Handler function for retrieving group conversation details.
 *
 * @returns A JSON response containing the group conversation details.
 */
export async function GET(req: NextRequest, { params }: { params: Params }) {
	// Extract the conversation ID from the request parameters.
	const conversationId = params.conversationId;

	// Retrieve the current user from the session
	const currentUser = await getCurrentUser();

	// Check if the current user is authenticated. If not, respond with an unauthorized status.
	if (!currentUser) {
		return NextResponse.json(
			{ success: false, message: "Unauthorized! Access denied" },
			{ status: 401 }
		);
	}

	try {
		// Execute a database transaction to fetch conversation details and member counts.
		const groupDetailsResult = await prisma.$transaction(async (prismaClient) => {
			// Fetch the group conversation details if the user is a member.
			const conversation = await prismaClient.conversation.findFirst({
				where: {
					isGroup: true,
					id: conversationId,
					members: { some: { userId: currentUser.id } },
				},
				include: {
					creator: { omit: { password: true } },
					groupDetails: {
						select: {
							name: true,
							description: true,
							icon: { select: { url: true } },
						},
					},
				},
			});

			// If the group conversation is not found, return null.
			if (!conversation) return null;

			// Count the total number of members in the conversation.
			const totalMembers = await prismaClient.member.count({
				where: { conversationId: conversation.id },
			});

			// Count the number of online members in the conversation.
			const totalMembersOnline = await prismaClient.member.count({
				where: { conversationId: conversation.id, user: { isOnline: true } },
			});

			return { conversation, totalMembers, totalMembersOnline };
		});

		// If the group conversation does not exist, respond with a 404 error.
		if (!groupDetailsResult) {
			return NextResponse.json(
				{ success: false, message: "The specified conversation could not be found." },
				{ status: 404 }
			);
		}

		// Destructure the response data for easier access.
		const { conversation, totalMembers, totalMembersOnline } = groupDetailsResult;

		// Construct the response data in the GroupOverview format.
		const data: GroupOverview = {
			id: conversation.id,
			name: conversation.groupDetails?.name ?? "",
			description: conversation.groupDetails?.description,
			createdAt: conversation.createdAt,
			icon: conversation.groupDetails?.icon?.url ?? null,
			creator: conversation.creator,
			members: {
				total: totalMembers,
				online: totalMembersOnline,
			},
		};

		return NextResponse.json({
			success: true,
			message: "Group conversation details retrieved successfully.",
			data,
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "An unexpected error occurred. Please try again later" },
			{ status: 500 }
		);
	}
}
