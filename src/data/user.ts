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

export { getUserById, getUserByEmail, getUserByUsername };
