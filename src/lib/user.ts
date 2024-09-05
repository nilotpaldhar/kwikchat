import { prisma } from "@/lib/db";

/**
 * Updates the online status of a user in the database.
 */
const setUserOnlineStatus = async ({ userId, isOnline }: { userId: string; isOnline: boolean }) => {
	try {
		await prisma.user.update({
			where: { id: userId },
			data: {
				isOnline: isOnline,
				lastSeen: isOnline ? null : new Date(),
			},
		});
		return true;
	} catch (error) {
		return false;
	}
};

// eslint-disable-next-line import/prefer-default-export
export { setUserOnlineStatus };
