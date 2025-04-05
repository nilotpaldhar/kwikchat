import "server-only";

import { auth } from "@/auth";
import { getUserById, getCachedUserById } from "@/data/user";

async function getSession() {
	const session = await auth();
	return session;
}

async function getCurrentUser(cached = false) {
	const session = await auth();
	const id = session?.user.id as string;

	if (cached) {
		const user = await getCachedUserById(id);
		return user;
	}

	const user = await getUserById(id, true);
	return user;
}

export { getSession, getCurrentUser };
