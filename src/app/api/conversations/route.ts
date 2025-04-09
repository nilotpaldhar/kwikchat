import { type NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/data/auth/session";
import { getUserConversationsWithMetadata } from "@/data/conversation";

/**
 * Handler function for retrieving user conversations with metadata.
 *
 * @returns A JSON response containing the status, message, and data (if successful).
 */
export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;

	// Extract query parameters with default values
	const page = searchParams.get("page");
	const pageSize = searchParams.get("page_size");
	const groupOnly = searchParams.get("group_only");
	const includeUnreadOnly = searchParams.get("include_unread_only");

	// Retrieve the current user from the session
	const currentUser = await getCurrentUser();

	// Check if the current user is authenticated. If not, respond with an unauthorized status.
	if (!currentUser) {
		return NextResponse.json(
			{ success: false, message: "Unauthorized! Access denied" },
			{ status: 401 }
		);
	}

	// Fetch paginated ConversationsWithMetadata for the currentUser
	const data = await getUserConversationsWithMetadata({
		userId: currentUser.id,
		page: page ? parseInt(page, 10) : undefined,
		pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
		groupOnly: groupOnly === "true",
		includeUnreadOnly: includeUnreadOnly === "true",
		excludeDeleted: true,
	});

	return NextResponse.json({
		success: true,
		message: "List of all conversations with metadata",
		data,
	});
}
