"use server";

import * as z from "zod";
import { ResetPasswordSchema } from "@/schemas";

import { prisma } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { hashPassword } from "@/lib/auth/password-utils";

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
		return { error: MESSAGE.error.emailNotExist };
	}

	const hashedPassword = hashPassword(password);

	try {
		await prisma.user.update({
			where: { id: existingUser.id },
			data: { password: hashedPassword },
		});

		await prisma.passwordResetToken.delete({
			where: { token },
		});

		return { success: MESSAGE.success.resetPassword };
	} catch (error) {
		return { error: MESSAGE.error.resetPassword };
	}
}

export default resetPassword;
