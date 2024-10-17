import { type NextRequest, NextResponse } from "next/server";

import { MessageReactionSchema } from "@/schemas";

import { prisma } from "@/lib/db";

import { pusherServer } from "@/lib/pusher/server";
import { conversationEvents } from "@/constants/pusher-events";

import { getCurrentUser } from "@/data/auth/session";
import { getUserMessage } from "@/data/message";

import handleUserMessageError from "@/utils/api/handle-user-message-error";
import { generatePrivateChatChannelName } from "@/utils/pusher/generate-chat-channel-name";

type Params = {
	conversationId: string;
	messageId: string;
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
		const { message, receiverId, error } = await getUserMessage({
			messageId,
			conversationId,
			userId,
		});

		// Handle possible errors based on the returned error type
		if (error || !message || !receiverId) {
			return handleUserMessageError(error!);
		}

		// Create the message reaction record in the database
		const newMessageReaction = await prisma.messageReaction.create({
			data: { type: reactionType, emoji, emojiImageUrl, messageId: message.id, userId },
		});

		// Notify the other conversation member of the reaction using Pusher
		pusherServer.trigger(
			generatePrivateChatChannelName({
				conversationId: message.conversationId,
				receiverId,
			}),
			conversationEvents.createReaction,
			newMessageReaction
		);

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
 * Handler function for
 *
 * @returns A JSON response
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
		const { message, receiverId, error } = await getUserMessage({
			messageId,
			conversationId,
			userId,
		});

		// Fetch the message and verify the user's permission to remove the reaction
		if (error || !message || !receiverId) {
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

		pusherServer.trigger(
			generatePrivateChatChannelName({
				conversationId: message.conversationId,
				receiverId,
			}),
			conversationEvents.updateReaction,
			updatedMessageReaction
		);

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
		const { message, receiverId, error } = await getUserMessage({
			messageId,
			conversationId,
			userId,
		});

		// Fetch the message and verify the user's permission to remove the reaction
		if (error || !message || !receiverId) {
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

		// Notify the other conversation member about the reaction removal using Pusher
		pusherServer.trigger(
			generatePrivateChatChannelName({
				conversationId: message.conversationId,
				receiverId,
			}),
			conversationEvents.removeReaction,
			messageReaction
		);

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
