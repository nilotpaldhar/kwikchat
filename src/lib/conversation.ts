import "server-only";

import { type Media, type Prisma, MemberRole } from "@prisma/client";
import type { MediaWithoutId } from "@/types";

import { prisma } from "@/lib/db";
import { pusherServer } from "@/lib/pusher/server";

import { saveMedia } from "@/lib/media";
import { hasAnyFriendshipWithUser } from "@/lib/friendship";
import { uploadImage, deleteImageOrFile } from "@/lib/upload";

import generateConversationLifecycleChannel, {
	ConversationLifecycle,
} from "@/utils/pusher/generate-conversation-lifecycle-channel";

export enum AddGroupConversationMemberError {
	InvalidFriendship = "InvalidFriendship",
	UnknownError = "UnknownError",
}

interface AddGroupConversationMemberResponse {
	success: boolean;
	error: AddGroupConversationMemberError | null;
}

/**
 *  Creates a new private one-on-one conversation between two users.
 */
const createPrivateConversation = async ({
	userId1,
	userId2,
}: {
	userId1: string;
	userId2: string;
}) => {
	const conversation = await prisma.conversation.create({
		data: {
			isGroup: false,
			createdBy: userId1,
			members: {
				create: [{ user: { connect: { id: userId1 } } }, { user: { connect: { id: userId2 } } }],
			},
		},
	});

	return conversation;
};

/**
 * Creates a new group conversation, including the group details and members.
 */
const createGroupConversation = async ({
	groupName,
	groupDescription,
	groupMemberIds,
	groupIcon,
	createdBy,
}: {
	groupName: string;
	groupDescription: string | null;
	groupMemberIds: string[];
	groupIcon: MediaWithoutId | null;
	createdBy: string;
}) => {
	// Use a database transaction to ensure atomicity for creating the group conversation and its members
	const groupConversation = await prisma.$transaction(async (prismaClient) => {
		// Step 1: Create the group conversation record
		const conversation = await prismaClient.conversation.create({
			data: {
				isGroup: true, // Flag to indicate this is a group conversation
				createdBy, // The user who created the group
				groupDetails: {
					create: {
						name: groupName,
						description: groupDescription,
						icon: groupIcon ? { create: groupIcon } : undefined,
					},
				},
			},
		});

		// Step 2: Add members to the group conversation
		await prismaClient.member.createMany({
			data: [createdBy, ...groupMemberIds].map((memberId) => ({
				conversationId: conversation.id,
				userId: memberId,
				// Assign admin role to the creator
				role: memberId === createdBy ? MemberRole.admin : MemberRole.member,
			})),
		});

		return conversation;
	});

	return groupConversation;
};

/**
 * Clears a conversation for a specific user by marking messages as deleted
 * and removing any starred messages linked to that conversation.
 */
const clearConversation = async ({
	conversationId,
	userId,
}: {
	conversationId: string;
	userId: string;
}) => {
	try {
		// Fetch the conversation that matches the given conversationId and includes the user as a member.
		// Also, retrieve the list of message IDs in that conversation.
		const conversation = await prisma.conversation.findFirst({
			where: {
				id: conversationId,
				members: { some: { userId } }, // Ensure the user is a member of the conversation.
			},
			include: {
				messages: { select: { id: true } }, // Include only message IDs in the response.
			},
		});

		// If the conversation doesn't exist or the user is not a member, return false.
		if (!conversation) return false;

		// Create an array of data to mark each message as deleted for the user.
		const deletionData = conversation.messages.map((message) => ({
			messageId: message.id,
			userId,
		}));

		// Execute a transaction to mark messages as deleted and remove starred messages in the conversation for the user.
		await prisma.$transaction([
			prisma.deletedMessage.createMany({
				data: deletionData,

				// Avoid creating duplicates if the messages are already marked as deleted
				skipDuplicates: true,
			}),

			// Delete starred messages in this conversation for the user.
			prisma.starredMessage.deleteMany({
				where: { message: { conversationId }, userId },
			}),
		]);

		return true;
	} catch (error) {
		return false;
	}
};

/**
 * Adds users as members to a group conversation.
 */
const addGroupConversationMembers = async ({
	conversationId,
	userId,
	userIdsToAdd,
}: {
	conversationId: string;
	userId: string;
	userIdsToAdd: string[];
}): Promise<AddGroupConversationMemberResponse> => {
	try {
		// Check if the initiating user has any valid friendships with the users being added
		const { hasNoFriends } = await hasAnyFriendshipWithUser({
			userId,
			friendIds: userIdsToAdd,
		});

		// If there are no valid friendships, return an error indicating invalid friendship
		if (hasNoFriends) {
			return {
				success: false,
				error: AddGroupConversationMemberError.InvalidFriendship,
			};
		}

		// Add the users as members to the group conversation in bulk
		const members = await prisma.member.createMany({
			data: userIdsToAdd.map((id) => ({
				conversationId,
				userId: id,
				role: MemberRole.member,
			})),
		});

		// If no members were added (unexpected scenario), return an unknown error
		if (members.count === 0) {
			return {
				success: false,
				error: AddGroupConversationMemberError.UnknownError,
			};
		}

		return { success: true, error: null };
	} catch (error) {
		return {
			success: false,
			error: AddGroupConversationMemberError.UnknownError,
		};
	}
};

/**
 * Function to upload a group conversation icon.
 */
async function uploadGroupConversationIcon({
	icon,
	groupId,
	userId,
}: {
	icon: string;
	groupId?: string;
	userId: string;
}) {
	try {
		const res = await uploadImage({
			image: icon,
			imageName: groupId ? `${groupId}-icon` : `unknown-group-icon`,
			folder: `${userId}/group-icons`,
		});
		return res;
	} catch (error) {
		return null;
	}
}

/**
 * Function to upload and update group conversation icon.
 */
const uploadAndUpdateGroupConversationIcon = async ({
	userId,
	conversationId,
	groupIcon,
	mediaId,
	mediaExternalId,
}: {
	userId: string;
	conversationId: string;
	groupIcon: string;
	mediaId?: string;
	mediaExternalId?: string;
}): Promise<Media | null> => {
	try {
		// Upload the group conversation icon
		const res = await uploadGroupConversationIcon({
			userId,
			groupId: conversationId,
			icon: groupIcon,
		});
		if (!res) return null;

		// Prepare data for saving media
		const data: Prisma.MediaCreateInput = {
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

		// Save or update the media
		const media = await saveMedia({ mediaId, data });

		// If there's an existing media ID and external media ID, delete the previous image or file
		if (mediaId && mediaExternalId) await deleteImageOrFile({ fileId: mediaExternalId });

		return media;
	} catch (error) {
		return null;
	}
};

/**
 * Updates the `updatedAt` timestamp of a conversation in the database.
 */
const updateConversationTimestamp = async ({ conversationId }: { conversationId: string }) => {
	try {
		await prisma.conversation.update({
			where: { id: conversationId },
			data: { updatedAt: new Date() },
		});

		return true;
	} catch (error) {
		return false;
	}
};

/**
 * Broadcasts a conversation event to a specific receiver or multiple receivers.
 */
const broadcastConversation = async <ConversationPayload>({
	receiver,
	eventType,
	eventName,
	payload,
}: {
	receiver: string | string[];
	eventType: ConversationLifecycle;
	eventName: string;
	payload: ConversationPayload;
}) => {
	// Determine the channel name(s) based on the receiver(s) and event type.
	const channelName =
		typeof receiver === "string"
			? generateConversationLifecycleChannel({ receiverId: receiver, lifecycle: eventType })
			: receiver.map((r) =>
					generateConversationLifecycleChannel({ receiverId: r, lifecycle: eventType })
				);

	try {
		await pusherServer.trigger(channelName, eventName, payload);
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error("Failed to broadcast conversation update.");
	}
};

export {
	createPrivateConversation,
	createGroupConversation,
	clearConversation,
	addGroupConversationMembers,
	uploadGroupConversationIcon,
	uploadAndUpdateGroupConversationIcon,
	updateConversationTimestamp,
	broadcastConversation,
};
