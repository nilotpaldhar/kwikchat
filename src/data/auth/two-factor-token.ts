import { prisma } from "@/lib/db";

async function getTwoFactorTokenByOTP(otp: string) {
	try {
		const twoFactorToken = await prisma.twoFactorToken.findUnique({
			where: { otp },
		});

		return twoFactorToken;
	} catch (error) {
		return null;
	}
}

async function getTwoFactorTokenByEmail(email: string) {
	try {
		const twoFactorToken = await prisma.twoFactorToken.findFirst({
			where: { email },
		});

		return twoFactorToken;
	} catch (error) {
		return null;
	}
}

export { getTwoFactorTokenByOTP, getTwoFactorTokenByEmail };
