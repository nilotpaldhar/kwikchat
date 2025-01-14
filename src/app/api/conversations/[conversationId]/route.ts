import { type NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/data/auth/session";
import { getUserConversationWithMetadata } from "@/data/conversation";

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

	// Query the database to find the specified conversation that the current user is a part of.
	const conversation = await getUserConversationWithMetadata({
		conversationId,
		userId,
		excludeDeleted: true,
	});

	// If the conversation does not exist, respond with a 404 error.
	if (!conversation) {
		return NextResponse.json(
			{ success: false, message: "The specified conversation could not be found." },
			{ status: 404 }
		);
	}

	return NextResponse.json({
		success: true,
		message: "The conversation details have been successfully retrieved.",
		data: conversation,
	});
}

/**
 * Handler function for deleting a conversation.
 *
 * @returns A JSON response indicating the result of the conversation deletion operation.
 */
export async function DELETE(req: NextRequest, { params }: { params: Params }) {
	// Retrieve the current user from the session (with authentication required)
	const currentUser = await getCurrentUser(true);

	// Check if the current user is authenticated. If not, respond with an unauthorized status.
	if (!currentUser) {
		return NextResponse.json(
			{ success: false, message: "Unauthorized! Access denied" },
			{ status: 401 }
		);
	}

	// Extract the current user's ID and the conversation ID from the request parameters.
	const userId = currentUser.id;
	const { conversationId } = params;

	try {
		// Retrieve the conversation that the user is a member of, based on the provided conversationId.
		const conversation = await prisma.conversation.findFirst({
			where: {
				id: conversationId,
				members: { some: { userId } },
			},
		});

		// If no conversation is found, return a 404 error indicating that the conversation does not exist.
		if (!conversation) {
			return NextResponse.json(
				{ success: false, message: "The specified conversation could not be found." },
				{ status: 404 }
			);
		}

		// Mark the conversation as deleted by upserting into the DeletedConversation table.
		// If the conversation has already been marked as deleted, update the timestamp. If not, create a new entry.
		await prisma.deletedConversation.upsert({
			where: {
				userId_conversationId: { userId, conversationId },
			},
			update: { deletedAt: new Date() },
			create: { userId, conversationId },
		});

		return NextResponse.json({
			success: true,
			message: "The conversation has been successfully deleted.",
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "An unexpected error occurred. Please try again later" },
			{ status: 500 }
		);
	}
}
