"use server";

import type { MediaWithoutId } from "@/types";

import * as z from "zod";
import { NewGroupSchema } from "@/schemas";

import { uploadImage } from "@/lib/upload";
import { getCurrentUser } from "@/data/auth/session";
import { createGroupConversation } from "@/lib/conversation";
import { hasAnyFriendshipWithUser } from "@/lib/friendship";

import { INIT_GROUP_CONVERSATION_MESSAGE as MESSAGE } from "@/constants/conversation";

async function uploadGroupIcon({
	icon,
	groupName,
	userId,
}: {
	icon: string;
	groupName: string;
	userId: string;
}) {
	try {
		const res = await uploadImage({
			image: icon,
			imageName: `${groupName}-icon`,
			folder: `${userId}/group-icons`,
		});
		return res;
	} catch (error) {
		return null;
	}
}

const initGroupConversation = async (values: z.infer<typeof NewGroupSchema>) => {
	const validatedFields = NewGroupSchema.safeParse(values);
	if (!validatedFields.success) return { error: MESSAGE.error.invalidFields };

	// Get the current user from the session
	const currentUser = await getCurrentUser();
	if (!currentUser || !currentUser.email) {
		return { error: MESSAGE.error.unauthorized };
	}

	const { groupName, groupDescription, groupMemberIds, groupIcon } = validatedFields.data;
	let icon: MediaWithoutId | null = null;

	try {
		// Check if group members are friends
		const { hasNoFriends } = await hasAnyFriendshipWithUser({
			userId: currentUser.id,
			friendIds: groupMemberIds,
		});
		if (hasNoFriends) return { error: MESSAGE.error.invalidMembers };

		// Upload group icon
		if (groupIcon) {
			const res = await uploadGroupIcon({
				icon: groupIcon,
				groupName,
				userId: currentUser.id,
			});

			if (!res) return { error: MESSAGE.error.iconUploadFailed };

			icon = {
				externalId: res.fileId,
				name: res.name,
				size: res.size,
				filePath: res.filePath,
				url: res.url,
				fileType: "image",
				height: res.height ?? null,
				width: res.width ?? null,
				thumbnailUrl: res.thumbnailUrl ?? null,
			};
		}

		// Create group conversation
		const groupConversation = await createGroupConversation({
			groupName,
			groupDescription: groupDescription ?? null,
			groupMemberIds,
			groupIcon: icon,
			createdBy: currentUser.id,
		});

		return { redirectPath: `/messenger/chats/${groupConversation.id}` };
	} catch (error) {
		return { error: MESSAGE.error.notKnown };
	}
};

export default initGroupConversation;
