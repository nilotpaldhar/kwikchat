"use server";

import { revalidatePath } from "next/cache";

import * as z from "zod";
import { Toggle2FASchema } from "@/schemas";

import { prisma } from "@/lib/db";

import validateCredentials from "@/lib/auth/validate-credentials";
import { getCurrentUser } from "@/data/auth/session";

import { TOGGLE_2FA_MESSAGE as MESSAGE } from "@/constants/auth";

async function toggle2FA(values: z.infer<typeof Toggle2FASchema>) {
	const validatedFields = Toggle2FASchema.safeParse(values);
	if (!validatedFields.success) {
		return { error: MESSAGE.error.invalidFields };
	}
	const { password } = validatedFields.data;

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
		password,
	});
	if (!user && error) {
		return { error: MESSAGE.error.invalidCredentials };
	}

	// Toggle 2FA in the database
	try {
		const updatedUserSettings = await prisma.userSettings.update({
			where: { userId: user.id },
			data: {
				twoFactorEnabled: !user.userSettings?.twoFactorEnabled,
			},
		});

		revalidatePath("/account-security");

		return {
			success: updatedUserSettings.twoFactorEnabled
				? MESSAGE.success.enabled
				: MESSAGE.success.disabled,
		};
	} catch (err) {
		return { error: MESSAGE.error.notKnown };
	}
}

export default toggle2FA;
