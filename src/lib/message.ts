import "server-only";

import type { SystemMessageEvent } from "@prisma/client";
import type { CompleteMessage, ConversationWithMembers, MessageSeenMembers } from "@/types";

import { prisma } from "@/lib/db";
import { pusherServer } from "@/lib/pusher/server";

import { isBlocked } from "@/lib/block";
import { MESSAGE_INCLUDE } from "@/data/message";
import { areUsersFriends } from "@/lib/friendship";
import { updateConversationTimestamp } from "@/lib/conversation";

import generateChatMessagingChannel from "@/utils/pusher/generate-chat-messaging-channel";
import transformMessageSeenAndStarStatus from "@/utils/messenger/transform-message-seen-and-star-status";

export enum DeleteMessageError {
	MessageNotFound = "MessageNotFound",
	MessageAlreadyDeleted = "MessageAlreadyDeleted",
	UserNotAuthorized = "UserNotAuthorized",
	UnknownError = "UnknownError",
}

interface DeleteMessageResponse {
	messageId: string | null;
	error: DeleteMessageError | null;
}

export enum SendPrivateMessageError {
	ReceiverNotFound = "ReceiverNotFound",
	SenderBlocked = "SenderBlocked",
	FriendshipNotFound = "FriendshipNotFound",
	UnknownError = "UnknownError",
}

interface SendPrivateMessageResponse {
	receiverId: string | null;
	message: CompleteMessage | null;
	error: SendPrivateMessageError | null;
}

export enum SendGroupMessageError {
	NotGroupMember = "NotGroupMember",
	UnknownError = "UnknownError",
}

interface SendGroupMessageResponse {
	receiverIds: string[];
	message: CompleteMessage | null;
	error: SendGroupMessageError | null;
}

/**
 * Creates a system message associated with a conversation and user.
 */
const createSystemMessage = async ({
	conversationId,
	userId,
	event,
	content,
}: {
	conversationId: string;
	userId: string;
	event: SystemMessageEvent;
	content: string;
}): Promise<CompleteMessage | null> => {
	try {
		const message = await prisma.message.create({
			data: {
				conversationId,
				senderId: userId,
				type: "system",
				systemMessage: {
					create: { event, content },
				},
			},
			include: MESSAGE_INCLUDE,
		});

		// Update conversation timestamp
		await updateConversationTimestamp({ conversationId: message.conversationId });

		return transformMessageSeenAndStarStatus({ message: message, userId });
	} catch (error) {
		return null;
	}
};

/**
 * Updates the seen status for a list of message IDs by a given member.
 * This function upserts (inserts or updates) the seen status in the database
 * and returns a list of messages with the IDs and users who have seen them.
 */
const updateMessageSeenStatus = async ({
	messageIds,
	memberId,
}: {
	messageIds: string[];
	memberId: string;
}) => {
	try {
		// Perform a transaction to upsert the seen status for each message
		const seenStatusUpdates = await prisma.$transaction(
			messageIds.map((messageId) =>
				prisma.messageSeenStatus.upsert({
					where: {
						messageId_memberId: { messageId, memberId },
					},
					update: { seenAt: new Date() },
					create: { messageId, memberId, seenAt: new Date() },
					include: { member: { select: { userId: true } } },
				})
			)
		);

		// Aggregate the seen status by messageId and members who have seen it
		const aggregatedSeenStatus = seenStatusUpdates.reduce((acc: MessageSeenMembers[], status) => {
			const { messageId, member } = status;
			const existingMessage = acc.find((item) => item.messageId === messageId);

			if (existingMessage) {
				existingMessage.seenByMembers.push(member.userId);
			} else {
				acc.push({ messageId, seenByMembers: [member.userId] });
			}

			return acc;
		}, []);

		return aggregatedSeenStatus;
	} catch (error) {
		return [];
	}
};

/**
 * Deletes a message in a conversation based on the user's action.
 *
 * If `deleteForEveryone` is true, the message is marked as deleted for all users.
 * Otherwise, it is deleted only for the requesting user.
 */
const deleteMessage = async ({
	conversationId,
	messageId,
	userId,
	deleteForEveryone = false,
}: {
	conversationId: string;
	messageId: string;
	userId: string;
	deleteForEveryone?: boolean;
}): Promise<DeleteMessageResponse> => {
	try {
		// Find the message in the specified conversation that the user is a member of.
		const message = await prisma.message.findFirst({
			where: {
				id: messageId,
				conversationId,
				conversation: {
					members: { some: { userId } }, // Ensure the user is a member of the conversation.
				},
			},
		});

		// If the message doesn't exist or the user is not authorized, return an error.
		if (!message) {
			return {
				messageId: null,
				error: DeleteMessageError.MessageNotFound,
			};
		}

		// Handle the case where the message should be deleted for everyone in the conversation.
		if (deleteForEveryone) {
			// Check if the message is already deleted for everyone.
			if (message.isDeleted) {
				return {
					messageId: null,
					error: DeleteMessageError.MessageAlreadyDeleted,
				};
			}

			// Ensure that only the sender of the message can delete it for everyone.
			if (message.senderId !== userId) {
				return {
					messageId: null,
					error: DeleteMessageError.UserNotAuthorized,
				};
			}

			// Mark the message as deleted for everyone and clean up related data.
			await prisma.$transaction([
				// Mark the message as deleted and update its type.
				prisma.message.update({
					where: { id: message.id },
					data: { isDeleted: true, type: "deleted" },
				}),

				// Remove all reactions to the deleted message.
				prisma.messageReaction.deleteMany({
					where: { messageId: message.id },
				}),

				// Delete the text content of the message.
				prisma.textMessage.deleteMany({
					where: { messageId: message.id },
				}),

				// Delete the image content of the message.
				prisma.imageMessage.deleteMany({
					where: { messageId: message.id },
				}),

				// Remove the message from the user's starred messages.
				prisma.starredMessage.deleteMany({
					where: { messageId: message.id, userId },
				}),
			]);
		} else {
			// Handle the case where the message is deleted only for the requesting user.
			const existingDeletion = await prisma.deletedMessage.findUnique({
				where: { messageId_userId: { messageId, userId } },
			});

			// If the message is already marked as deleted for the user, return an error.
			if (existingDeletion) {
				return {
					messageId: null,
					error: DeleteMessageError.MessageAlreadyDeleted,
				};
			}

			// Mark the message as deleted for the specific user and remove it from their starred messages.
			await prisma.$transaction([
				prisma.deletedMessage.create({
					data: { messageId: message.id, userId },
				}),
				prisma.starredMessage.deleteMany({
					where: { messageId: message.id, userId },
				}),
			]);
		}

		return { messageId: message.id, error: null };
	} catch (error) {
		return {
			messageId: null,
			error: DeleteMessageError.UnknownError,
		};
	}
};

/**
 * Sends a private message from one user to another within an existing conversation.
 */
const sendPrivateMessage = async ({
	conversation,
	senderId,
	messageContent,
}: {
	conversation: ConversationWithMembers;
	senderId: string;
	messageContent: string;
}): Promise<SendPrivateMessageResponse> => {
	// Helper function to build an error response
	const buildErrorResponse = (error: SendPrivateMessageError): SendPrivateMessageResponse => ({
		receiverId: null,
		message: null,
		error,
	});

	try {
		// Identify the receiver ID by finding the conversation member who isn't the sender.
		const receiverId = conversation.members.find((member) => member.userId !== senderId)?.userId;
		if (!receiverId) return buildErrorResponse(SendPrivateMessageError.ReceiverNotFound);

		// Check if the sender is blocked by the receiver.
		const blocked = await isBlocked({ blockerId: receiverId, blockedId: senderId });
		if (blocked) return buildErrorResponse(SendPrivateMessageError.SenderBlocked);

		// Verify if the sender and receiver are friends.
		const isFriend = await areUsersFriends({ senderId, receiverId });
		if (!isFriend) return buildErrorResponse(SendPrivateMessageError.FriendshipNotFound);

		// Create and save the message in the database.
		const message = await prisma.message.create({
			data: {
				conversationId: conversation.id,
				senderId,
				type: "text",
				textMessage: {
					create: { content: messageContent },
				},
			},
			include: MESSAGE_INCLUDE,
		});

		// Update conversation timestamp
		await updateConversationTimestamp({ conversationId: conversation.id });

		// Return the message along with the transformed status for the sender.
		return {
			receiverId,
			message: transformMessageSeenAndStarStatus({ message: message, userId: senderId }),
			error: null,
		};
	} catch (error) {
		return buildErrorResponse(SendPrivateMessageError.UnknownError);
	}
};

/**
 * Sends a message in a group conversation.
 */
const sendGroupMessage = async ({
	conversation,
	senderId,
	messageContent,
}: {
	conversation: ConversationWithMembers;
	senderId: string;
	messageContent: string;
}): Promise<SendGroupMessageResponse> => {
	// Helper function to build an error response
	const buildErrorResponse = (error: SendGroupMessageError): SendGroupMessageResponse => ({
		receiverIds: [],
		message: null,
		error,
	});

	try {
		// Check if the sender is a member of the conversation
		const isMember = conversation.members.some((member) => member.userId === senderId);
		if (!isMember) {
			return buildErrorResponse(SendGroupMessageError.NotGroupMember);
		}

		// Collect IDs of all members except the sender to notify them of the new message
		const receiverIds = conversation.members
			.filter((member) => member.userId !== senderId)
			.map((member) => member.userId);

		// Create the message in the database, linking it to the conversation and sender
		const message = await prisma.message.create({
			data: {
				conversationId: conversation.id,
				senderId,
				type: "text",
				textMessage: {
					create: { content: messageContent },
				},
			},
			include: MESSAGE_INCLUDE,
		});

		// Update conversation timestamp
		await updateConversationTimestamp({ conversationId: conversation.id });

		// Transform the message for the sender with seen and star status
		return {
			receiverIds,
			message: transformMessageSeenAndStarStatus({ message: message, userId: senderId }),
			error: null,
		};
	} catch (error) {
		return buildErrorResponse(SendGroupMessageError.UnknownError);
	}
};

/**
 * Broadcasts a private message to a specific user via a Pusher channel.
 */
const broadcastPrivateMessage = async <MessagePayload>({
	conversationId,
	eventName,
	receiverId,
	payload,
}: {
	conversationId: string;
	eventName: string;
	receiverId: string;
	payload: MessagePayload;
}) => {
	try {
		// Generate the private chat channel ID for the receiver based on the conversation and receiver IDs
		const channelId = generateChatMessagingChannel({
			conversationId,
			receiverId,
		});

		// Trigger the specified event on the generated channel with the payload
		await pusherServer.trigger(channelId, eventName, payload);
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error("Failed to broadcast private message.");
	}
};

/**
 * Broadcasts a group message to all specified receivers via Pusher channels.
 */
const broadcastGroupMessage = async <MessagePayload>({
	conversationId,
	eventName,
	receiverIds,
	payload,
}: {
	conversationId: string;
	eventName: string;
	receiverIds: string[];
	payload: MessagePayload;
}) => {
	try {
		// Generate group chat channel IDs for each receiver
		const groupChatChannelIds = receiverIds.map((receiverId) =>
			generateChatMessagingChannel({
				conversationId: conversationId,
				conversationType: "group",
				receiverId,
			})
		);

		// Trigger the event on all channels with the message as payload
		await pusherServer.trigger(groupChatChannelIds, eventName, payload);
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error("Failed to broadcast group message.");
	}
};

export {
	createSystemMessage,
	updateMessageSeenStatus,
	deleteMessage,
	sendPrivateMessage,
	sendGroupMessage,
	broadcastPrivateMessage,
	broadcastGroupMessage,
};
