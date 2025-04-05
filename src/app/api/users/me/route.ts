/* eslint-disable import/prefer-default-export */

import { NextResponse } from "next/server";

import { getSession } from "@/data/auth/session";
import { getCachedUserById } from "@/data/user";

/**
 * Handler function to retrieve the current authenticated user's details.
 *
 * @returns A JSON response containing the status, message, and data of current authenticated user.
 */
export async function GET() {
	const session = await getSession();

	// Check if the session exists and contains a valid user ID.
	// If not, respond with a 500 Internal Server Error status.
	if (!session?.user.id) {
		return NextResponse.json(
			{ success: false, message: "Failed to fetched user" },
			{ status: 500 }
		);
	}

	// Fetch the current user's details from the cache by user ID.
	const currentUser = await getCachedUserById(session?.user.id);

	// Check if the user exists. If not, respond with a 401 Unauthorized status.
	if (!currentUser) {
		return NextResponse.json(
			{ success: false, message: "Unauthorized! Access denied" },
			{ status: 401 }
		);
	}

	// Destructure the user object and omit the password field from the response.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { password, ...currentUserWithoutPassword } = currentUser;

	return NextResponse.json({
		success: true,
		message: "User fetched successfully",
		data: currentUserWithoutPassword,
	});
}
