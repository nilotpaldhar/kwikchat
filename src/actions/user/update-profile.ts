"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import * as z from "zod";
import { ProfileSchema } from "@/schemas";

import { prisma } from "@/lib/db";

import { uploadAvatar } from "@/lib/upload";
import { getCurrentUser } from "@/data/auth/session";

import { AVATAR_UPLOAD_MESSAGE, PROFILE_UPDATE_MESSAGE } from "@/constants/user";

// Updates the user's profile with new data.
async function updateProfile(values: z.infer<typeof ProfileSchema>) {
	// Validate the input data against the profile schema
	const validatedFields = ProfileSchema.safeParse(values);
	if (!validatedFields.success) {
		return {
			error: validatedFields.error.errors[0].message ?? AVATAR_UPLOAD_MESSAGE.error.invalidFields,
		};
	}
	const { displayName, bio, avatar, bannerColor } = validatedFields.data;
	let avatarUrl = null;

	// Get the current user from the session
	const currentUser = await getCurrentUser();
	if (!currentUser || !currentUser.email) {
		return { error: AVATAR_UPLOAD_MESSAGE.error.unauthorized };
	}

	// Upload the new avatar if it has changed
	if (avatar && currentUser.avatar !== avatar) {
		const uploadRes = await uploadAvatar({
			avatar,
			username: currentUser?.username as string,
			userId: currentUser?.id,
		});
		avatarUrl = uploadRes?.url;
		if (!avatarUrl) return { error: AVATAR_UPLOAD_MESSAGE.error.failedToUpload };
	}

	// Update the user profile in the database
	try {
		await prisma.user.update({
			where: { id: currentUser.id },
			data: {
				displayName,
				bio,
				avatar: avatarUrl ?? currentUser.avatar,
				banner_color: bannerColor,
			},
		});

		return { success: PROFILE_UPDATE_MESSAGE.success.updateProfile };
	} catch (err) {
		return { error: PROFILE_UPDATE_MESSAGE.error.updateProfile };
	} finally {
		revalidateTag("get-user-by-id");
		revalidatePath("/account-profile");
	}
}

export default updateProfile;
