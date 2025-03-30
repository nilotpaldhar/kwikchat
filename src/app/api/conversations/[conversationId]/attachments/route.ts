/* eslint-disable import/prefer-default-export */

import { type NextRequest, NextResponse } from "next/server";
import { FileType } from "@prisma/client";

import { getCurrentUser } from "@/data/auth/session";
import { getConversationMedia } from "@/data/media";
import { getUserConversation } from "@/data/conversation";

type Params = { conversationId: string };

// Function to map a media type string to the corresponding FileType enum
const getMediaType = (mediaType: string) => {
	if (mediaType === "image") return FileType.image;
	if (mediaType === "document") return FileType.document;
	return null;
};

/**
 * Handler function for retrieving media associated with a conversation.
 *
 * @returns A JSON response containing the requested media data.
 */
export async function GET(req: NextRequest, { params }: { params: Params }) {
	// Extract search parameters from the request URL
	const searchParams = req.nextUrl.searchParams;
	const page = searchParams.get("page");
	const pageSize = searchParams.get("page_size");
	const mediaType = searchParams.get("media_type") ?? "";

	// Retrieve the current user from the session (with authentication required)
	const currentUser = await getCurrentUser();

	// Check if the current user is authenticated. If not, respond with an unauthorized status.
	if (!currentUser) {
		return NextResponse.json(
			{ success: false, message: "Unauthorized! Access denied" },
			{ status: 401 }
		);
	}

	// Extract user ID and conversation ID from the authenticated user and request parameters
	const userId = currentUser.id;
	const conversationId = params.conversationId;

	// Fetch the conversation details for the authenticated user
	const conversation = await getUserConversation({ conversationId, userId });

	// If the conversation does not exist, return a 404 Not Found response
	if (!conversation) {
		return NextResponse.json(
			{ success: false, message: "The specified conversation could not be found." },
			{ status: 404 }
		);
	}

	// Fetch the media associated with the conversation, applying pagination and filtering by media type
	const data = await getConversationMedia({
		conversationId: conversation.id,
		page: page ? parseInt(page, 10) : undefined,
		pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
		mediaType: getMediaType(mediaType),
	});

	return NextResponse.json({
		success: true,
		message: "Media retrieved successfully.",
		data,
	});
}
