"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import * as z from "zod";
import { UpdateUsernameSchema } from "@/schemas";

import { prisma } from "@/lib/db";

import { getUserByUsername } from "@/data/user";
import { getCurrentUser } from "@/data/auth/session";
import validateCredentials from "@/lib/auth/validate-credentials";

import { UPDATE_USERNAME_MESSAGE as MESSAGE } from "@/constants/auth";

async function updateUsername(values: z.infer<typeof UpdateUsernameSchema>) {
	const validatedFields = UpdateUsernameSchema.safeParse(values);
	if (!validatedFields.success) {
		return { error: MESSAGE.error.invalidFields };
	}
	const { newUsername, currentPassword } = validatedFields.data;

	// Get the current user from the session
	const currentUser = await getCurrentUser();
	if (!currentUser || !currentUser.email) {
		return { error: MESSAGE.error.unauthorized };
	}

	// Validate current user credentials
	const { user, error } = await validateCredentials({
		email: currentUser.email,
		password: currentPassword,
	});
	if (!user && error) {
		return { error: MESSAGE.error.invalidCredentials };
	}

	// Check username
	const existingUserWithUsername = await getUserByUsername(newUsername);
	if (existingUserWithUsername && existingUserWithUsername?.email) {
		return { error: MESSAGE.error.usernameTaken };
	}

	// Update username
	try {
		await prisma.user.update({
			where: { id: user.id },
			data: { username: newUsername },
		});

		revalidateTag("get-user-by-id");
		revalidatePath("/account");

		return { success: MESSAGE.success.updateUsername };
	} catch (err) {
		return { error: MESSAGE.error.updateUsername };
	}
}

export default updateUsername;
