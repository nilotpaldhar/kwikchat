"use server";

import * as z from "zod";
import { SigninSchema } from "@/schemas";

import { prisma } from "@/lib/db";
import { signIn as nextAuthSignIn } from "@/auth";

import validateCredentials from "@/lib/auth/validate-credentials";
import { getTwoFactorTokenByEmail } from "@/data/auth/two-factor-token";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken, generateTwoFactorToken } from "@/lib/auth/tokens";
import { getTwoFactorConfirmationByUserId } from "@/data/auth/two-factor-confirmation";

import { SIGNIN_MESSAGE as MESSAGE } from "@/constants/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/constants/routes";

async function signin(values: z.infer<typeof SigninSchema>) {
	const validatedFields = SigninSchema.safeParse(values);
	if (!validatedFields.success) {
		return { error: MESSAGE.error.invalidFields };
	}

	const { email, password, otp } = validatedFields.data;
	const { user: existingUser } = await validateCredentials({ email, password });
	if (!existingUser) {
		return { error: MESSAGE.error.invalidCredentials };
	}

	/** Check if the email has been verified */
	if (!existingUser.emailVerified) {
		try {
			const verificationToken = await generateVerificationToken(email);
			await sendVerificationEmail({ email, token: verificationToken.token });
			return { success: MESSAGE.success.verificationEmail };
		} catch (error) {
			return { error: MESSAGE.error.verificationEmail };
		}
	}

	/** Check two factor authentication */
	if (existingUser.userSettings?.twoFactorEnabled && existingUser.email && existingUser.password) {
		if (otp) {
			/** Verify OTP */
			const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

			if (!twoFactorToken) {
				return { error: MESSAGE.error.invalidTwoFactorAuthOtp };
			}

			const hasExpired = new Date(twoFactorToken.expires) < new Date();
			if (twoFactorToken.otp !== otp || hasExpired) {
				return { error: MESSAGE.error.invalidTwoFactorAuthOtp };
			}

			try {
				/** Remove two factor token */
				await prisma.twoFactorToken.delete({
					where: { id: twoFactorToken.id },
				});

				/** Remove existing two factor confirmation */
				const existing2FAConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
				if (existing2FAConfirmation) {
					await prisma.twoFactorConfirmation.delete({
						where: { id: existing2FAConfirmation.id },
					});
				}

				/** Create new confirmation */
				await prisma.twoFactorConfirmation.create({
					data: { userId: existingUser.id },
				});
			} catch (error) {
				return { error: MESSAGE.error.signingIn };
			}
		} else {
			/** Create OTP && Send Email */
			try {
				const twoFactorToken = await generateTwoFactorToken(existingUser.email);
				await sendTwoFactorTokenEmail({
					email: twoFactorToken.email,
					otp: twoFactorToken.otp,
				});
			} catch (error) {
				return { error: MESSAGE.error.twoFactorAuthEmail };
			}

			return { twoFactor: true };
		}
	}

	await nextAuthSignIn("credentials", {
		email,
		password,
		redirectTo: DEFAULT_LOGIN_REDIRECT,
	});

	return { success: MESSAGE.success.signingIn };
}

export default signin;
