import { nanoid } from "nanoid";

import { prisma } from "@/lib/db";
import { getVerificationTokenByEmail } from "@/data/auth/verification-token";

async function generateVerificationToken(email: string) {
	const token = nanoid();
	const expires = new Date(new Date().getTime() + 3600 * 1000);

	const existingToken = await getVerificationTokenByEmail(email);

	if (existingToken) {
		await prisma.verificationToken.delete({
			where: { id: existingToken.id },
		});
	}

	try {
		const verificationToken = await prisma.verificationToken.create({
			data: { email, token, expires },
		});

		return verificationToken;
	} catch (err) {
		throw new Error("Failed to generate verification token");
	}
}

// eslint-disable-next-line import/prefer-default-export
export { generateVerificationToken };
