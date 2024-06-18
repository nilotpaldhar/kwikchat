"use server";

import bcrypt from "bcryptjs";

import * as z from "zod";
import { ResetPasswordSchema } from "@/schemas";

import { prisma } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { signIn as nextAuthSignIn } from "@/auth";

import { DEFAULT_LOGIN_REDIRECT } from "@/constants/routes";
import { RESET_PASSWORD_MESSAGE as MESSAGE } from "@/constants/auth";

async function resetPassword({
	values,
	token,
	email,
}: {
	values: z.infer<typeof ResetPasswordSchema>;
	token: string;
	email: string;
}) {
	const validatedFields = ResetPasswordSchema.safeParse(values);
	if (!validatedFields.success || !token || !email) {
		return { error: MESSAGE.error.invalidFields };
	}

	const { password } = validatedFields.data;

	const existingUser = await getUserByEmail(email);
	if (!existingUser) {
		return { error: MESSAGE.error.emailNoExist };
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	try {
		await prisma.user.update({
			where: { id: existingUser.id },
			data: { password: hashedPassword },
		});

		await prisma.passwordResetToken.delete({
			where: { token },
		});
	} catch (error) {
		return { error: MESSAGE.error.resetPassword };
	}

	await nextAuthSignIn("credentials", {
		email,
		password,
		redirectTo: DEFAULT_LOGIN_REDIRECT,
	});

	return { success: MESSAGE.success.resetPassword };
}

export default resetPassword;
