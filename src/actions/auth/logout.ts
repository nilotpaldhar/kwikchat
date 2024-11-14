"use server";

import { signOut } from "@/auth";
import { broadcastUserStatus, setUserOnlineStatus } from "@/lib/user";
import { getCurrentUser } from "@/data/auth/session";

async function logout() {
	const currentUser = await getCurrentUser();
	if (!currentUser || !currentUser.email) {
		return { error: "Unauthorized" };
	}

	// Set the user's online status to offline in the system
	await setUserOnlineStatus({ userId: currentUser.id, isOnline: false });

	// Notifies friends of a user's status change
	await broadcastUserStatus({ userId: currentUser.id, action: "logout" });

	// Sign the user out and redirect them to the sign-in page
	await signOut({ redirectTo: "/sign-in" });

	return { success: "You've successfully logged out" };
}

export default logout;
