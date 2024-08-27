/* eslint-disable import/prefer-default-export */

import { NextResponse } from "next/server";

import { getSession } from "@/data/auth/session";
import { getCachedUserById } from "@/data/user";

export async function GET() {
	const session = await getSession();
	if (!session?.user.id) {
		return NextResponse.json(
			{ success: false, message: "Failed to fetched user" },
			{ status: 500 }
		);
	}

	const currentUser = await getCachedUserById(session?.user.id);
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
