/* eslint-disable import/prefer-default-export */

import { type NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/data/auth/session";
import { getUserConversation } from "@/data/conversation";
import { getStarredMessages } from "@/data/starred-message";

interface Params {
	conversationId: string;
}

export async function GET(req: NextRequest, { params }: { params: Params }) {
	// Extract query parameters from the URL for pagination
	const searchParams = req.nextUrl.searchParams;
	const conversationId = params.conversationId;

	// Extract query parameters with default values
	const page = searchParams.get("page");
	const pageSize = searchParams.get("page_size");

	// Retrieve the current user from the session (with authentication required)
	const currentUser = await getCurrentUser(true);

	// Check if the current user is authenticated. If not, respond with an unauthorized status.
	if (!currentUser) {
		return NextResponse.json(
			{ success: false, message: "Unauthorized! Access denied" },
			{ status: 401 }
		);
	}

	// Check if the conversation exists and if the user is a member of it
	const conversation = await getUserConversation({ conversationId, userId: currentUser.id });

	// If the conversation is not found or the user is not a member, respond with a 404 status
	if (!conversation) {
		return NextResponse.json(
			{
				success: false,
				message: "Conversation not found. Please verify your access or the conversation ID.",
			},
			{ status: 404 }
		);
	}

	// Fetch paginated starred messages for the conversation
	const data = await getStarredMessages({
		conversationId: conversation.id,
		userId: currentUser.id,
		page: page ? parseInt(page, 10) : undefined,
		pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
	});

	return NextResponse.json({
		success: true,
		message: "List of all starred messages",
		data,
	});
}
