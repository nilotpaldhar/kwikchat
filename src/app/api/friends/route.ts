import { type NextRequest, NextResponse } from "next/server";

import { getFriends } from "@/data/friendship";
import { getCurrentUser } from "@/data/auth/session";

/**
 * Handler function for retrieving friends for the current user.
 *
 * @returns A JSON response containing the status, message, and data of friends.
 */
export async function GET(req: NextRequest) {
	// Extract search parameters from the request URL
	const searchParams = req.nextUrl.searchParams;

	// Retrieve the current user from the session
	const currentUser = await getCurrentUser();

	// Extract query parameters with default values
	const page = searchParams.get("page");
	const pageSize = searchParams.get("page_size");
	const query = searchParams.get("query") ?? "";
	const isOnline = searchParams.get("is_online");
	const isRecent = searchParams.get("is_recent");

	// Check if the current user is authenticated. If not, respond with an unauthorized status.
	if (!currentUser) {
		return NextResponse.json(
			{ success: false, message: "Unauthorized! Access denied" },
			{ status: 401 }
		);
	}

	// Fetch the list of friends for the current user with applied filters and pagination
	const data = await getFriends({
		userId: currentUser.id,
		page: page ? parseInt(page, 10) : undefined,
		pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
		query,
		isOnline: isOnline === "true",
		isRecent: isRecent === "true",
	});

	return NextResponse.json({
		success: true,
		message: "List of all friends",
		data,
	});
}
