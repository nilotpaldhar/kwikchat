"use server";

import * as z from "zod";
import { ForgotPasswordSchema } from "@/schemas";

import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/auth/tokens";

import { FORGOT_PASSWORD_MESSAGE as MESSAGE } from "@/constants/auth";

async function forgotPassword(values: z.infer<typeof ForgotPasswordSchema>) {
	const validatedFields = ForgotPasswordSchema.safeParse(values);
	if (!validatedFields.success) {
		return { error: MESSAGE.error.invalidFields };
	}

	const { email } = validatedFields.data;
	const existingUser = await getUserByEmail(email);

	if (!existingUser || !existingUser.email) {
		return { error: MESSAGE.error.emailNoExist };
	}

	if (!existingUser.password) {
		return { error: "Oauth does not support password reset" };
	}

	try {
		const passwordResetToken = await generatePasswordResetToken(existingUser.email);
		await sendPasswordResetEmail({ email, token: passwordResetToken.token });

		return { success: MESSAGE.success.resetEmail };
	} catch (error) {
		return { error: MESSAGE.error.resetEmail };
	}
}

export default forgotPassword;
