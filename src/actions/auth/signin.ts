"use server";

import * as z from "zod";
import { SigninSchema } from "@/schemas";

import { signIn as nextAuthSignIn } from "@/auth";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/auth/tokens";
import validateCredentials from "@/lib/auth/validate-credentials";

import { SIGNIN_MESSAGE as MESSAGE } from "@/constants/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/constants/routes";

async function signin(values: z.infer<typeof SigninSchema>) {
	const validatedFields = SigninSchema.safeParse(values);
	if (!validatedFields.success) {
		return { error: MESSAGE.error.invalidFields };
	}

	const { email, password } = validatedFields.data;
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

	await nextAuthSignIn("credentials", {
		email,
		password,
		redirectTo: DEFAULT_LOGIN_REDIRECT,
	});

	return { success: MESSAGE.success.signingIn };
}

export default signin;
