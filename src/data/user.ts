import "server-only";

import { unstable_cache as cache } from "next/cache";
import { prisma } from "@/lib/db";

async function getUserById(id: string, withSettings: boolean = false) {
	try {
		const user = await prisma.user.findUnique({
			where: { id },
			include: { userSettings: withSettings },
		});
		return user;
	} catch (error) {
		return null;
	}
}

async function getUserByEmail(email: string, withSettings: boolean = false) {
	try {
		const user = await prisma.user.findUnique({
			where: { email },
			include: { userSettings: withSettings },
		});
		return user;
	} catch (error) {
		return null;
	}
}

async function getUserByUsername(username: string, withSettings: boolean = false) {
	try {
		const user = await prisma.user.findUnique({
			where: { username },
			include: { userSettings: withSettings },
		});
		return user;
	} catch (error) {
		return null;
	}
}

const getCachedUserById = cache(async (id: string) => getUserById(id, true), ["get-user-by-id"]);

export { getUserById, getUserByEmail, getUserByUsername, getCachedUserById };
