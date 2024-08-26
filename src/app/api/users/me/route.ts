/* eslint-disable import/prefer-default-export */

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/data/auth/session";

export async function GET() {
	const currentUser = await getCurrentUser();

	if (!currentUser) {
		return NextResponse.json(
			{ success: false, message: "Failed to fetched user" },
			{ status: 500 }
		);
	}

	// Destructure the user object and omit the password field
	const { password, ...currentUserWithoutPassword } = currentUser;

	return NextResponse.json({
		success: true,
		message: "User fetched successfully",
		data: currentUserWithoutPassword,
	});
}
