import "server-only";

import { prisma } from "@/lib/db";

async function getResetTokenByToken(token: string) {
	try {
		const resetToken = await prisma.passwordResetToken.findUnique({
			where: { token },
		});
		return resetToken;
	} catch (error) {
		return null;
	}
}

async function getResetTokenByEmail(email: string) {
	try {
		const resetToken = await prisma.passwordResetToken.findFirst({
			where: { email },
		});
		return resetToken;
	} catch (error) {
		return null;
	}
}

export { getResetTokenByToken, getResetTokenByEmail };
