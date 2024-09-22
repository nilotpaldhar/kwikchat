/* eslint-disable import/prefer-default-export */

import { type NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/data/auth/session";

type Params = { conversationId: string };

/**
 * Handler function for retrieving conversation participant details.
 *
 * @returns A JSON response containing the status, message, and data of participant.
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
		// Find the unique conversation that includes the current user as a member.
		const conversation = await prisma.conversation.findFirst({
			where: {
				id: conversationId,
				members: { some: { userId: currentUser.id } },
			},
			include: {
				members: { include: { user: { omit: { password: true } } } },
			},
		});

		// If the conversation does not exist, respond with a 404 status.
		if (!conversation) {
			return NextResponse.json(
				{ success: false, message: "The specified conversation could not be found." },
				{ status: 404 }
			);
		}

		// Find the participant (the other user in the conversation) by filtering out the current user.
		const participant = conversation.members.filter((member) => member.userId !== currentUser.id)[0]
			.user;

		// If the participant could not be found, respond with a 404 status.
		if (!participant) {
			return NextResponse.json(
				{ success: false, message: "Unable to retrieve participant details." },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			message: "Participant details have been successfully retrieved.",
			data: participant,
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "An unexpected error occurred. Please try again later" },
			{ status: 500 }
		);
	}
}
