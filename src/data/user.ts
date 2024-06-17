import { prisma } from "@/lib/db";

async function getUserById(id: string) {
	try {
		const user = await prisma.user.findUnique({
			where: { id },
		});
		return user;
	} catch (error) {
		return null;
	}
}

async function getUserByEmail(email: string) {
	try {
		const user = await prisma.user.findUnique({
			where: { email },
		});
		return user;
	} catch (error) {
		return null;
	}
}

async function getUserByUsername(username: string) {
	try {
		const user = await prisma.user.findUnique({
			where: { username },
		});
		return user;
	} catch (error) {
		return null;
	}
}

export { getUserById, getUserByEmail, getUserByUsername };
