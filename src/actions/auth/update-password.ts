"use server";

import * as z from "zod";
import { UpdatePasswordSchema } from "@/schemas";

import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password-utils";

import { getCurrentUser } from "@/data/auth/session";
import validateCredentials from "@/lib/auth/validate-credentials";

import { UPDATE_PASSWORD_MESSAGE as MESSAGE } from "@/constants/auth";

async function updatePassword(values: z.infer<typeof UpdatePasswordSchema>) {
	const validatedFields = UpdatePasswordSchema.safeParse(values);
	if (!validatedFields.success) {
		return { error: MESSAGE.error.invalidFields };
	}
	const { currentPassword, newPassword } = validatedFields.data;

	// Get the current user from the session
	const currentUser = await getCurrentUser();
	if (!currentUser || !currentUser.email) {
		return { error: MESSAGE.error.unauthorized };
	}

	if (!currentUser.password) {
		return { error: MESSAGE.error.oAuth };
	}

	// Validate current user credentials
	const { user, error } = await validateCredentials({
		email: currentUser.email,
		password: currentPassword,
	});
	if (!user && error) {
		return { error: MESSAGE.error.invalidCredentials };
	}

	// Hash the new password using bcrypt
	const hashedNewPassword = hashPassword(newPassword);

	// Update user password in the database
	try {
		await prisma.user.update({
			where: { id: user.id },
			data: { password: hashedNewPassword },
		});

		return { success: MESSAGE.success.updatePassword };
	} catch (err) {
		return { error: MESSAGE.error.updatePassword };
	}
}

export default updatePassword;
