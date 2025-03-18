/**
 * This file handles sending and broadcasting messages.
 * It includes functions for private messaging, group messaging,
 * and broadcasting messages to multiple recipients.
 */

import "server-only";

import type { CompleteMessage, ConversationWithMembers } from "@/types";
import type { MessagePayloadSchemaType } from "@/schemas";

import { pusherServer } from "@/lib/pusher/server";

import { isBlocked } from "@/lib/block";
import { areUsersFriends } from "@/lib/friendship";
import { createMessage } from "@/lib/message/message-factory";
import { updateConversationTimestamp, restoreDeletedConversation } from "@/lib/conversation";

import generateChatMessagingChannel from "@/utils/pusher/generate-chat-messaging-channel";
import transformMessageSeenAndStarStatus from "@/utils/messenger/transform-message-seen-and-star-status";

export enum SendPrivateMessageError {
	ReceiverNotFound = "ReceiverNotFound",
	SenderBlocked = "SenderBlocked",
	FriendshipNotFound = "FriendshipNotFound",
	MessageCreationFailed = "MessageCreationFailed",
	UnknownError = "UnknownError",
}

export interface SendPrivateMessageResponse {
	receiverId: string | null;
	message: CompleteMessage | null;
	error: SendPrivateMessageError | null;
}

export enum SendGroupMessageError {
	NotGroupMember = "NotGroupMember",
	MessageCreationFailed = "MessageCreationFailed",
	UnknownError = "UnknownError",
}

export interface SendGroupMessageResponse {
	receiverIds: string[];
	message: CompleteMessage | null;
	error: SendGroupMessageError | null;
}

/**
 * Sends a private message from one user to another within an existing conversation.
 */
const sendPrivateMessage = async ({
	conversation,
	senderId,
	messagePayload,
}: {
	conversation: ConversationWithMembers;
	senderId: string;
	messagePayload: MessagePayloadSchemaType;
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
		const message = await createMessage({
			conversationId: conversation.id,
			userId: senderId,
			isGroup: false,
			messageType: messagePayload.messageType,
			payload: messagePayload.message,
		});
		if (!message) return buildErrorResponse(SendPrivateMessageError.MessageCreationFailed);

		await Promise.all([
			// Update conversation timestamp
			updateConversationTimestamp({ conversationId: conversation.id }),

			// Automatically restore the Conversation for the other User (if deleted previously)
			restoreDeletedConversation({ conversationId: conversation.id, userIds: [receiverId] }),
		]);

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
	messagePayload,
}: {
	conversation: ConversationWithMembers;
	senderId: string;
	messagePayload: MessagePayloadSchemaType;
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
		const message = await createMessage({
			conversationId: conversation.id,
			userId: senderId,
			isGroup: true,
			messageType: messagePayload.messageType,
			payload: messagePayload.message,
		});
		if (!message) return buildErrorResponse(SendGroupMessageError.MessageCreationFailed);

		await Promise.all([
			// Update conversation timestamp
			updateConversationTimestamp({ conversationId: conversation.id }),

			// Automatically restore the Conversation for the other Users (if deleted previously)
			restoreDeletedConversation({ conversationId: conversation.id, userIds: receiverIds }),
		]);

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

export { sendPrivateMessage, sendGroupMessage, broadcastPrivateMessage, broadcastGroupMessage };
