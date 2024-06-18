import { nanoid } from "nanoid";

import { TokenValidationStatus } from "@/types";

import { prisma } from "@/lib/db";
import { getResetTokenByEmail, getResetTokenByToken } from "@/data/auth/password-reset-token";
import {
	getVerificationTokenByEmail,
	getVerificationTokenByToken,
} from "@/data/auth/verification-token";
import { getUserByEmail } from "@/data/user";

async function generateVerificationToken(email: string) {
	const token = nanoid();
	const expires = new Date(new Date().getTime() + 3600 * 1000);

	const existingToken = await getVerificationTokenByEmail(email);

	if (existingToken) {
		try {
			await prisma.verificationToken.delete({
				where: { id: existingToken.id },
			});
		} catch (error) {
			throw new Error("Failed to delete old verification token");
		}
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

async function generatePasswordResetToken(email: string) {
	const token = nanoid();
	const expires = new Date(new Date().getTime() + 3600 * 1000);

	const existingToken = await getResetTokenByEmail(email);

	if (existingToken) {
		try {
			await prisma.passwordResetToken.delete({
				where: { id: existingToken.id },
			});
		} catch (error) {
			throw new Error("Failed to delete old password reset token");
		}
	}

	try {
		const resetToken = await prisma.passwordResetToken.create({
			data: { email, token, expires },
		});

		return resetToken;
	} catch (err) {
		throw new Error("Failed to generate password reset token");
	}
}

async function validateToken({
	token,
	tokenType,
}: {
	token: string;
	tokenType: "VerificationToken" | "PasswordResetToken";
}) {
	let existingToken = null;

	if (!token) {
		return {
			data: {},
			status: TokenValidationStatus.InvalidToken,
		};
	}

	if (tokenType === "VerificationToken") {
		existingToken = await getVerificationTokenByToken(token);
	} else if (tokenType === "PasswordResetToken") {
		existingToken = await getResetTokenByToken(token);
	}

	if (!existingToken) {
		return {
			data: {},
			status: TokenValidationStatus.InvalidToken,
		};
	}

	const hasExpired = new Date(existingToken.expires) < new Date();
	if (hasExpired) {
		return {
			data: {},
			status: TokenValidationStatus.TokenExpired,
		};
	}

	const existingUser = await getUserByEmail(existingToken.email);
	if (!existingUser) {
		return {
			data: {},
			status: TokenValidationStatus.InvalidTokenEmail,
		};
	}

	try {
		if (tokenType === "VerificationToken") {
			await prisma.user.update({
				where: { id: existingUser.id },
				data: {
					emailVerified: new Date(),
					email: existingToken.email,
				},
			});

			await prisma.verificationToken.delete({
				where: { id: existingToken.id },
			});
		}

		return {
			data: { email: existingUser.email, token: existingToken.token },
			status: TokenValidationStatus.Default,
		};
	} catch (error) {
		return {
			data: {},
			status: TokenValidationStatus.ValidationFailed,
		};
	}
}

export { generateVerificationToken, generatePasswordResetToken, validateToken };
