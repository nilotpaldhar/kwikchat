import type { CompleteMessage } from "@/types";

import { type NextRequest, NextResponse } from "next/server";

import { TextMessageSchema } from "@/schemas";

import { prisma } from "@/lib/db";
import {
	deleteMessage,
	broadcastPrivateMessage,
	broadcastGroupMessage,
	DeleteMessageError,
} from "@/lib/message";

import { MESSAGE_INCLUDE } from "@/data/message";
import { getCurrentUser } from "@/data/auth/session";

import { conversationEvents } from "@/constants/pusher-events";
import isGroupAdmin from "@/utils/messenger/is-group-admin";
import transformMessageSeenAndStarStatus from "@/utils/messenger/transform-message-seen-and-star-status";

type Params = Promise<{
	conversationId: string;
	messageId: string;
}>;

/**
 * Broadcasts a message to members of a conversation.
 * This function determines whether the conversation is a group or private chat
 * and broadcasts the message accordingly.
 */
const broadcastMessage = async ({
	conversationId,
	isGroupConversation,
	members,
	currentUserId,
	payload,
}: {
	conversationId: string;
	isGroupConversation: boolean;
	members: { userId: string }[];
	currentUserId: string;
	payload: CompleteMessage;
}) => {
	// Define the event name to be broadcasted
	const eventName = conversationEvents.updateMessage;

	if (isGroupConversation) {
		// For group conversations, broadcast the message to all members
		const receiverIds = members.map((member) => member.userId);
		await broadcastGroupMessage({ conversationId, eventName, receiverIds, payload });

		return true;
	}

	// For private conversations, find the recipient user ID (excluding the current user)
	const receiverId = members.find((member) => member.userId !== currentUserId)?.userId;

	// If no valid recipient is found, return false (e.g., if the conversation has no other members)
	if (!receiverId) return false;

	// Call the broadcasting function for private messages
	await broadcastPrivateMessage({ conversationId, eventName, receiverId, payload });

	return true;
};

/**
 * Handler function for updating a text message in a conversation.
 *
 * @returns A JSON response indicating the success or failure of the update.
 */
export async function PATCH(req: NextRequest, segmentData: { params: Params }) {
	const params = await segmentData.params;

	// Parse the request body to extract the message content
	const body = await req.json();

	// Validate the incoming message content against the TextMessageSchema
	const validatedFields = TextMessageSchema.safeParse(body);
	if (!validatedFields.success) {
		return NextResponse.json(
			{
				success: false,

				message: validatedFields.error.format().message?._errors[0] ?? "Invalid Fields",
			},
			{ status: 400 }
		);
	}

	// Retrieve the current user from the session (with authentication required)
	const currentUser = await getCurrentUser(true);

	// Check if the current user is authenticated. If not, respond with an unauthorized status.
	if (!currentUser) {
		return NextResponse.json(
			{ success: false, message: "Unauthorized! Access denied" },
			{ status: 401 }
		);
	}

	// Extract conversationId and messageId from route parameters
	const { conversationId, messageId } = params;
	const messageContent = validatedFields.data.message;

	try {
		// Find the target message in the database, including its conversation and members
		const message = await prisma.message.findFirst({
			where: { id: messageId, conversationId },
			include: {
				conversation: { include: { members: true } },
			},
		});

		// If the message does not exist, return a 404 not found error
		if (!message) {
			return NextResponse.json(
				{
					success: false,
					message:
						"The specified message could not be located. Please verify the details and try again.",
				},
				{ status: 404 }
			);
		}

		// Permission check: Ensure the user is allowed to edit the message
		if (!message.conversation.isGroup && message.senderId !== currentUser.id) {
			return NextResponse.json(
				{ success: false, message: "You are not allowed to update this message." },
				{ status: 403 }
			);
		}

		if (
			message.conversation.isGroup &&
			message.senderId !== currentUser.id &&
			!isGroupAdmin({ userId: currentUser.id, members: message.conversation.members })
		) {
			return NextResponse.json(
				{ success: false, message: "Only group admins can update this message." },
				{ status: 403 }
			);
		}

		// Only text messages are editable; reject updates to other message types
		if (message.type !== "text") {
			return NextResponse.json(
				{
					success: false,
					message: "Only text messages can be updated. Other message types are not editable.",
				},
				{ status: 422 }
			);
		}

		// Update the message content in the database
		const updatedMessage = await prisma.message.update({
			where: { id: message.id },
			data: {
				textMessage: { update: { data: { content: messageContent } } },
			},
			include: MESSAGE_INCLUDE,
		});

		// Transform the updated message to include seen and starred status for the current user
		const data: CompleteMessage = transformMessageSeenAndStarStatus({
			message: updatedMessage,
			userId: currentUser.id,
		});

		// Notify all conversation members about the updated message
		await broadcastMessage({
			conversationId: updatedMessage.conversationId,
			members: message.conversation.members,
			isGroupConversation: message.conversation.isGroup,
			currentUserId: currentUser.id,
			payload: data,
		});

		return NextResponse.json({
			success: true,
			message: "Your message has been updated successfully!",
			data,
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "An unexpected error occurred. Please try again later" },
			{ status: 500 }
		);
	}
}

/**
 * Handler function for the DELETE request to delete a message in a conversation.
 *
 * @returns A JSON response indicating the result of the message deletion operation.
 */
export async function DELETE(req: NextRequest, segmentData: { params: Params }) {
	const params = await segmentData.params;

	// Extract query parameters from the request URL.
	const searchParams = req.nextUrl.searchParams;

	// Retrieve the current user from the session (with authentication required)
	const currentUser = await getCurrentUser(true);

	// Check if the current user is authenticated. If not, respond with an unauthorized status.
	if (!currentUser) {
		return NextResponse.json(
			{ success: false, message: "Unauthorized! Access denied" },
			{ status: 401 }
		);
	}

	// Extract the user's ID, conversation ID, and message ID from the request parameters.
	const userId = currentUser.id;
	const { conversationId, messageId } = params;

	// Check if the request includes the flag to delete the message for everyone.
	const deleteForEveryone = searchParams.get("delete_for_everyone") === "true";

	// Attempt to delete the message based on the specified parameters.
	const { error } = await deleteMessage({
		conversationId,
		messageId,
		userId,
		deleteForEveryone,
	});

	// Handle any errors that occurred during the message deletion process.
	if (error) {
		switch (error) {
			case DeleteMessageError.MessageNotFound: {
				return NextResponse.json(
					{ success: false, message: "Message not found." },
					{ status: 404 }
				);
			}

			case DeleteMessageError.MessageAlreadyDeleted: {
				return NextResponse.json(
					{ success: false, message: "This message has already been deleted." },
					{ status: 400 }
				);
			}

			case DeleteMessageError.UserNotAuthorized: {
				return NextResponse.json(
					{ success: false, message: "You are not authorized to delete this message." },
					{ status: 400 }
				);
			}

			case DeleteMessageError.ContentDeletionFailed: {
				return NextResponse.json(
					{ success: false, message: "ContentDeletionFailed." },
					{ status: 500 }
				);
			}

			default: {
				return NextResponse.json(
					{ success: false, message: "An unexpected error occurred. Please try again later" },
					{ status: 500 }
				);
			}
		}
	}

	return NextResponse.json({
		success: true,
		message: "Message deleted successfully.",
	});
}
