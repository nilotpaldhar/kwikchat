import type { MessageReaction } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";

import { MessageReactionSchema } from "@/schemas";

import { prisma } from "@/lib/db";
import { broadcastGroupMessage, broadcastPrivateMessage } from "@/lib/message";

import { getUserMessage } from "@/data/message";
import { getCurrentUser } from "@/data/auth/session";

import { conversationEvents } from "@/constants/pusher-events";
import handleUserMessageError from "@/utils/api/handle-user-message-error";

type Params = {
	conversationId: string;
	messageId: string;
};

/**
 * Broadcasts a message reaction event to the appropriate recipients, handling both
 * group and private conversations.
 */
const broadcastMessageReaction = async ({
	conversationId,
	isGroupConversation,
	receiverId,
	receiverIds,
	eventName,
	payload,
}: {
	conversationId: string;
	isGroupConversation: boolean;
	receiverId: string | null;
	receiverIds: string[];
	eventName: string;
	payload: MessageReaction;
}) => {
	// Handle group conversations
	if (isGroupConversation) {
		await broadcastGroupMessage({ conversationId, eventName, receiverIds, payload });
		return true;
	}

	// Handle private conversations
	// If no valid recipient is found, return false (e.g., if the conversation has no other members)
	if (!receiverId) return false;

	// Call the broadcasting function for private messages
	await broadcastPrivateMessage({ conversationId, eventName, receiverId, payload });

	return true;
};

/**
 * Handler function for the creation of a message reaction for a conversation.
 *
 * @returns A JSON response with the result of the reaction creation process.
 */
export async function POST(req: NextRequest, { params }: { params: Params }) {
	// Parse the request body to extract the message reaction details
	const body = await req.json();

	// Validate the incoming message reaction against the schema
	const validatedFields = MessageReactionSchema.safeParse(body);
	if (!validatedFields.success) {
		return NextResponse.json({ success: false, message: "Invalid Fields" }, { status: 400 });
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

	// Extract required fields from the validated request body and params
	const userId = currentUser.id;
	const { conversationId, messageId } = params;
	const { reactionType, emoji, emojiImageUrl } = validatedFields.data;

	try {
		// Fetch the message and verify the user's permission to interact with it
		const { message, receiverId, receiverIds, error } = await getUserMessage({
			messageId,
			conversationId,
			userId,
		});

		// Handle possible errors based on the returned error type
		if (error || !message) {
			return handleUserMessageError(error!);
		}

		// Create the message reaction record in the database
		const newMessageReaction = await prisma.messageReaction.create({
			data: { type: reactionType, emoji, emojiImageUrl, messageId: message.id, userId },
		});

		// Broadcast a message reaction event to the appropriate recipients
		await broadcastMessageReaction({
			conversationId: message.conversationId,
			isGroupConversation: message.conversation.isGroup,
			receiverId,
			receiverIds,
			eventName: conversationEvents.createReaction,
			payload: newMessageReaction,
		});

		return NextResponse.json({
			success: true,
			message: "Reaction created successfully.",
			data: newMessageReaction,
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "An unexpected error occurred. Please try again later" },
			{ status: 500 }
		);
	}
}

/**
 * Handler function for updating the reaction of a message in a conversation.
 *
 * @returns A JSON response with the result of the reaction update process.
 */
export async function PATCH(req: NextRequest, { params }: { params: Params }) {
	// Parse the request body to extract the message reaction details
	const body = await req.json();

	// Validate the incoming message reaction against the schema
	const validatedFields = MessageReactionSchema.safeParse(body);
	if (!validatedFields.success) {
		return NextResponse.json({ success: false, message: "Invalid Fields" }, { status: 400 });
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

	// Extract required fields from the validated request body and params
	const userId = currentUser.id;
	const { conversationId, messageId } = params;
	const { reactionType, emoji, emojiImageUrl } = validatedFields.data;

	try {
		// Fetch the message and verify the user's permission to remove the reaction
		const { message, receiverId, receiverIds, error } = await getUserMessage({
			messageId,
			conversationId,
			userId,
		});

		// Fetch the message and verify the user's permission to remove the reaction
		if (error || !message) {
			return handleUserMessageError(error!);
		}

		// Find the user's reaction on the message
		const messageReaction = await prisma.messageReaction.findFirst({
			where: { messageId: message.id, userId },
		});

		// If no reaction is found, return an error
		if (!messageReaction) {
			return NextResponse.json(
				{ success: false, message: "Unable to update reaction." },
				{ status: 422 }
			);
		}

		// Update the message reaction
		const updatedMessageReaction = await prisma.messageReaction.update({
			where: { id: messageReaction.id },
			data: { type: reactionType, emoji, emojiImageUrl },
		});

		// Broadcast a message reaction event to the appropriate recipients
		await broadcastMessageReaction({
			conversationId: message.conversationId,
			isGroupConversation: message.conversation.isGroup,
			receiverId,
			receiverIds,
			eventName: conversationEvents.updateReaction,
			payload: updatedMessageReaction,
		});

		return NextResponse.json({
			success: true,
			message: "Reaction updated successfully.",
			data: updatedMessageReaction,
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "An unexpected error occurred. Please try again later" },
			{ status: 500 }
		);
	}
}

/**
 * Handler function for the removal of a message reaction for a conversation.
 *
 * @returns A JSON response with the result of the reaction removal process.
 */
export async function DELETE(req: NextRequest, { params }: { params: Params }) {
	// Retrieve the current user from the session (with authentication required)
	const currentUser = await getCurrentUser(true);

	// Check if the current user is authenticated. If not, respond with an unauthorized status.
	if (!currentUser) {
		return NextResponse.json(
			{ success: false, message: "Unauthorized! Access denied" },
			{ status: 401 }
		);
	}

	// Extract necessary fields from params
	const userId = currentUser.id;
	const { conversationId, messageId } = params;

	try {
		// Fetch the message and verify the user's permission to remove the reaction
		const { message, receiverId, receiverIds, error } = await getUserMessage({
			messageId,
			conversationId,
			userId,
		});

		// Fetch the message and verify the user's permission to remove the reaction
		if (error || !message) {
			return handleUserMessageError(error!);
		}

		// Find the user's reaction on the message
		const messageReaction = await prisma.messageReaction.findFirst({
			where: { messageId: message.id, userId },
		});

		// If no reaction is found, return an error
		if (!messageReaction) {
			return NextResponse.json(
				{ success: false, message: "Unable to remove reaction." },
				{ status: 422 }
			);
		}

		// Delete the reaction from the database
		await prisma.messageReaction.delete({
			where: { id: messageReaction.id },
		});

		// Broadcast a message reaction event to the appropriate recipients
		await broadcastMessageReaction({
			conversationId: message.conversationId,
			isGroupConversation: message.conversation.isGroup,
			receiverId,
			receiverIds,
			eventName: conversationEvents.removeReaction,
			payload: messageReaction,
		});

		return NextResponse.json({
			success: true,
			message: "Reaction removed successfully.",
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "An unexpected error occurred. Please try again later" },
			{ status: 500 }
		);
	}
}
