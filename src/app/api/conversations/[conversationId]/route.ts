/* eslint-disable import/prefer-default-export */

import { type NextRequest, NextResponse } from "next/server";
import type { ConversationWithMetadata } from "@/types";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/data/auth/session";

type Params = { conversationId: string };

/**
 * Handler function for retrieving user conversation with metadata.
 *
 * @returns A JSON response containing the status, message, and data (if successful).
 */
export async function GET(req: NextRequest, { params }: { params: Params }) {
	// Retrieve the current user from the session
	const currentUser = await getCurrentUser();

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
		// Query the database to find the specified conversation that the current user is a part of.
		const conversation = await prisma.conversation.findFirst({
			where: {
				id: conversationId,
				members: { some: { userId } },
			},
			include: {
				groupDetails: { include: { icon: true } },
				members: { select: { user: { omit: { password: true } } } },
				messages: {
					take: 1,
					orderBy: { createdAt: "desc" },
					include: { textMessage: true, imageMessage: true, systemMessage: true },
				},
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

		// Destructure the conversation data to extract key details
		const { messages, members, _count: count, ...rest } = conversation;

		// Identify the participant in a one-on-one conversation, excluding the current user.
		const participant =
			members.filter((member) => member.user.id !== userId).map((member) => member.user)[0] ?? null;

		// Construct the response data, including metadata and participant details if applicable.
		const data: ConversationWithMetadata = {
			...rest,
			unreadMessages: count.messages,
			recentMessage: messages[0] ?? null,
			participant: !conversation.isGroup ? participant : null,
		};

		return NextResponse.json({
			success: true,
			message: "The conversation details have been successfully retrieved.",
			data,
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "An unexpected error occurred. Please try again later" },
			{ status: 500 }
		);
	}
}
