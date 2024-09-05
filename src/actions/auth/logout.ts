"use server";

import { signOut } from "@/auth";
import { setUserOnlineStatus } from "@/lib/user";
import { getCurrentUser } from "@/data/auth/session";

async function logout() {
	const currentUser = await getCurrentUser();
	if (!currentUser || !currentUser.email) {
		return { error: "Unauthorized" };
	}

	await setUserOnlineStatus({ userId: currentUser.id, isOnline: false });
	await signOut({ redirectTo: "/sign-in" });

	return { success: "You've successfully logged out" };
}

export default logout;
