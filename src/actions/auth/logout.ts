"use server";

import { signOut } from "@/auth";
import { setUserOnlineStatus } from "@/lib/user";
import { pusherServer } from "@/lib/pusher/server";
import { friendEvents } from "@/constants/pusher-events";
import { getCurrentUser } from "@/data/auth/session";
import { getFriendsOfUser } from "@/data/friendship";

async function logout() {
	const currentUser = await getCurrentUser();
	if (!currentUser || !currentUser.email) {
		return { error: "Unauthorized" };
	}

	// Set the user's online status to offline in the system
	await setUserOnlineStatus({ userId: currentUser.id, isOnline: false });

	// Get the list of friends who are online and map their IDs
	const friends = await getFriendsOfUser({ userId: currentUser.id, isOnline: true });
	const friendIds = friends.map((friend) => friend.id);

	// Trigger a Pusher event to notify the user's friends that the user has gone offline
	pusherServer.trigger(friendIds, friendEvents.offline, currentUser.id);

	// Sign the user out and redirect them to the sign-in page
	await signOut({ redirectTo: "/sign-in" });

	return { success: "You've successfully logged out" };
}

export default logout;
