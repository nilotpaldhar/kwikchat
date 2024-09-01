/* eslint-disable import/prefer-default-export */

import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/data/auth/session";

/**
 * Handler function to retrieve the total count of pending friend requests for the current user.
 *
 * @returns A JSON response containing the status, message, and data of pending friend requests.
 */
export async function GET() {
	const currentUser = await getCurrentUser();

	// Check if the current user is authenticated. If not, respond with an unauthorized status.
	if (!currentUser) {
		return NextResponse.json(
			{ success: false, message: "Unauthorized! Access denied" },
			{ status: 401 }
		);
	}

	try {
		// Count the number of pending friend requests where the current user is either the sender or receiver.
		const pending = await prisma.friendRequest.count({
			where: {
				status: "pending",
				OR: [{ senderId: currentUser.id }, { receiverId: currentUser.id }],
			},
		});

		return NextResponse.json({
			success: true,
			message: "Total count of pending friend requests",
			data: { pending },
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "An unexpected error occurred. Please try again later" },
			{ status: 500 }
		);
	}
}
