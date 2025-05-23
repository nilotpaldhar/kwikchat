import "server-only";

import { prisma } from "@/lib/db";

async function getTwoFactorConfirmationByUserId(userId: string) {
	try {
		const twoFactorConfirmation = await prisma.twoFactorConfirmation.findUnique({
			where: { userId },
		});

		return twoFactorConfirmation;
	} catch (error) {
		return null;
	}
}

export { getTwoFactorConfirmationByUserId };
