/* eslint-disable import/prefer-default-export */

import { type NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/data/auth/session";

type Params = { conversationId: string };

/**
 * Handler function for retrieving unread messages count in a conversation.
 *
 * @returns A JSON response containing the status, message, and data (if successful).
 */
export async function GET(req: NextRequest, { params }: { params: Params }) {
	// Retrieve the current user from the session (with authentication required)
	const currentUser = await getCurrentUser(true);

	// Check if the current user is authenticated. If not, respond with an unauthorized status.
	if (!currentUser) {
		return NextResponse.json(
			{ success: false, message: "Unauthorized! Access denied" },
			{ status: 401 }
		);
	}

	// Extract the authenticated user's ID and the conversation ID from the request parameters.
	const userId = currentUser.id;
	const conversationId = params.conversationId;

	try {
		// Fetch the conversation from the database where the user is a member and the ID matches
		const conversation = await prisma.conversation.findFirst({
			where: {
				id: conversationId,
				members: { some: { userId } },
			},
			include: {
				_count: {
					select: {
						messages: {
							where: {
								senderId: { not: userId },
								seenByMembers: { none: { member: { userId } } },
							},
						},
					},
				},
			},
		});

		// If the conversation does not exist, respond with a 404 error.
		if (!conversation) {
			return NextResponse.json(
				{ success: false, message: "The specified conversation could not be found." },
				{ status: 404 }
			);
		}

		// Extract the unread messages count from the fetched conversation
		const {
			_count: { messages },
		} = conversation;

		return NextResponse.json({
			success: true,
			message: "Successfully retrieved the count of unread messages.",
			data: {
				unreadMessages: messages,
			},
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "An unexpected error occurred. Please try again later" },
			{ status: 500 }
		);
	}
}
