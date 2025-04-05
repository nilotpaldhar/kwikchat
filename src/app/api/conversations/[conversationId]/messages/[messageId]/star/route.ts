import { type NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";

import { getCurrentUser } from "@/data/auth/session";
import { getUserMessage, MESSAGE_INCLUDE } from "@/data/message";

import handleUserMessageError from "@/utils/api/handle-user-message-error";
import transformMessageSeenAndStarStatus from "@/utils/messenger/transform-message-seen-and-star-status";

interface Params {
	conversationId: string;
	messageId: string;
}

/**
 * Handler function for starring a message.
 *
 * @returns A JSON response indicating success or failure of the operation
 */
export async function POST(req: NextRequest, { params }: { params: Params }) {
	// Retrieve the current user from the session (with authentication required)
	const currentUser = await getCurrentUser(true);

	// Check if the current user is authenticated. If not, respond with an unauthorized status.
	if (!currentUser) {
		return NextResponse.json(
			{ success: false, message: "Unauthorized! Access denied" },
			{ status: 401 }
		);
	}

	// Extract required fields from the params
	const userId = currentUser.id;
	const { conversationId, messageId } = params;

	try {
		// Fetch the message and verify the user's permission to interact with it
		const { message, error } = await getUserMessage({
			messageId,
			conversationId,
			userId,
		});

		// Handle possible errors based on the returned error type
		if (error || !message) {
			return handleUserMessageError(error!);
		}

		// Create a starred message entry in the database
		const starredMessage = await prisma.starredMessage.create({
			data: { userId, messageId: message.id },
			include: {
				message: {
					include: MESSAGE_INCLUDE,
				},
			},
		});

		return NextResponse.json({
			success: true,
			message: "Message starred successfully!",
			data: transformMessageSeenAndStarStatus({
				message: starredMessage.message,
				userId: currentUser.id,
			}),
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "An unexpected error occurred. Please try again later" },
			{ status: 500 }
		);
	}
}

/**
 * Handler function for removing a star from a message.
 *
 * @returns A JSON response indicating success or failure of the operation
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

	// Extract required fields from the params
	const userId = currentUser.id;
	const { conversationId, messageId } = params;

	try {
		// Fetch the message and verify the user's permission to interact with it
		const { message, error } = await getUserMessage({
			messageId,
			conversationId,
			userId,
		});

		// Handle possible errors based on the returned error type
		if (error || !message) {
			return handleUserMessageError(error!);
		}

		// Remove the starred message entry from the database
		const deletedStarredMessage = await prisma.starredMessage.deleteMany({
			where: { userId, messageId: message.id },
		});

		if (deletedStarredMessage.count < 1) {
			return NextResponse.json(
				{
					success: false,
					message: "Unable to remove the star from the message. Please try again later.",
				},
				{ status: 422 }
			);
		}

		return NextResponse.json({
			success: true,
			message: "Star removed from the message successfully!",
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "An unexpected error occurred. Please try again later" },
			{ status: 500 }
		);
	}
}
