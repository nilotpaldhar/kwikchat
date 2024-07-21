import "server-only";

import { auth } from "@/auth";
import { getUserById } from "../user";

async function getSession() {
	const session = await auth();
	return session;
}

async function getCurrentUser() {
	const session = await auth();
	const id = session?.user.id as string;
	const user = await getUserById(id, true);
	return user;
}

export { getSession, getCurrentUser };
