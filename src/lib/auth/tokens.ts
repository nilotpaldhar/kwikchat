import { nanoid } from "nanoid";
import crypto from "crypto";

import { TokenValidationStatus } from "@/types";

import { prisma } from "@/lib/db";
import { getResetTokenByEmail, getResetTokenByToken } from "@/data/auth/password-reset-token";
import {
	getVerificationTokenByEmail,
	getVerificationTokenByToken,
} from "@/data/auth/verification-token";
import { getUserByEmail } from "@/data/user";
import { getTwoFactorTokenByEmail } from "@/data/auth/two-factor-token";

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

	switch (tokenType) {
		case "VerificationToken":
			existingToken = await getVerificationTokenByToken(token);
			break;
		case "PasswordResetToken":
			existingToken = await getResetTokenByToken(token);
			break;
		default:
			return {
				data: {},
				status: TokenValidationStatus.InvalidToken,
			};
	}

	if (!existingToken) {
		return {
			data: {},
			status: TokenValidationStatus.InvalidToken,
		};
	}

	if (new Date(existingToken.expires) < new Date()) {
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

async function generateVerificationToken(email: string) {
	const EXPIRATION_DURATION_MS = 3600 * 1000; // 60 minutes

	const token = nanoid();
	const expires = new Date(new Date().getTime() + EXPIRATION_DURATION_MS); // 60 minutes from now

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
	const EXPIRATION_DURATION_MS = 3600 * 1000; // 60 minutes

	const token = nanoid();
	const expires = new Date(new Date().getTime() + EXPIRATION_DURATION_MS); // 60 minutes from now

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

async function generateTwoFactorToken(email: string) {
	const OTP_LENGTH = 4;
	const EXPIRATION_DURATION_MS = 10 * 60 * 1000; // 10 minutes

	const otp = crypto.randomInt(10 ** (OTP_LENGTH - 1), 10 ** OTP_LENGTH).toString();
	const expires = new Date(Date.now() + EXPIRATION_DURATION_MS); // 10 minutes from now

	const existingToken = await getTwoFactorTokenByEmail(email);

	if (existingToken) {
		try {
			await prisma.twoFactorToken.delete({
				where: { id: existingToken.id },
			});
		} catch (error) {
			throw new Error("Failed to delete old two factor token");
		}
	}

	try {
		const twoFactorToken = await prisma.twoFactorToken.create({
			data: { email, otp, expires },
		});

		return twoFactorToken;
	} catch (err) {
		throw new Error("Failed to generate two factor token");
	}
}

export {
	generateVerificationToken,
	generatePasswordResetToken,
	generateTwoFactorToken,
	validateToken,
};
