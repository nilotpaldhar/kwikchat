/* eslint-disable import/prefer-default-export */

import { type NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/data/auth/session";
import { getMembershipDetails } from "@/data/member";

type Params = { conversationId: string };

/**
 * Handler function for retrieving membership details of the current user in a specific conversation.
 *
 * @returns A JSON response indicating the success or failure of the request, along with the relevant data or error message.
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

	// Retrieve the membership details for the user in the specified conversation.
	const membershipDetails = await getMembershipDetails({ conversationId, userId });

	// If no membership details are found, respond with a 404 Not Found status.
	// This indicates the user is not a member of the specified conversation.
	if (!membershipDetails) {
		return NextResponse.json(
			{ success: false, message: "No membership found for the specified conversation." },
			{ status: 404 }
		);
	}

	return NextResponse.json({
		success: true,
		message: "Membership details retrieved successfully.",
		data: membershipDetails,
	});
}
