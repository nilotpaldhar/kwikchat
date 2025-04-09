import { type NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/data/auth/session";
import { clearConversation } from "@/lib/conversation";

type Params = Promise<{ conversationId: string }>;

/**
 * Handler function for the DELETE request to clear a conversation.
 *
 * @returns A JSON response indicating the success or failure of the operation.
 */
export async function DELETE(req: NextRequest, segmentData: { params: Params }) {
	const params = await segmentData.params;

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

	// Attempt to clear the conversation for the current user.
	const clearedConversation = await clearConversation({ conversationId, userId });

	// If the conversation could not be cleared, respond with a 500 Internal Server Error status.
	if (!clearedConversation) {
		return NextResponse.json(
			{ success: false, message: "An unexpected error occurred. Please try again later" },
			{ status: 500 }
		);
	}

	// Respond with a success message if the conversation was cleared successfully.
	return NextResponse.json({
		success: true,
		message: "All messages in the conversation have been cleared.",
	});
}
