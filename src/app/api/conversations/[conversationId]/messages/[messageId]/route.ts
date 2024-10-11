/* eslint-disable import/prefer-default-export */

import type { CompleteMessage } from "@/types";

import { type NextRequest, NextResponse } from "next/server";

import { TextMessageSchema } from "@/schemas";

import { prisma } from "@/lib/db";

import { pusherServer } from "@/lib/pusher/server";
import { conversationEvents } from "@/constants/pusher-events";

import { MESSAGE_INCLUDE } from "@/data/message";
import { getCurrentUser } from "@/data/auth/session";

import { generatePrivateChatChannelName } from "@/utils/pusher/generate-chat-channel-name";
import transformMessageSeenAndStarStatus from "@/utils/messenger/transform-message-seen-and-star-status";

type Params = {
	conversationId: string;
	messageId: string;
};

/**
 * Handler function for updating a text message in a conversation.
 *
 * @returns A JSON response indicating the success or failure of the update.
 */
export async function PATCH(req: NextRequest, { params }: { params: Params }) {
	// Parse the request body to extract the message content
	const body = await req.json();

	// Validate the incoming message content against the TextMessageSchema
	const validatedFields = TextMessageSchema.safeParse(body);
	if (!validatedFields.success) {
		return NextResponse.json(
			{
				success: false,
				// eslint-disable-next-line no-underscore-dangle
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

	// Extract necessary parameters and data from the request
	const senderId = currentUser.id;
	const { conversationId, messageId } = params;
	const messageContent = validatedFields.data.message;

	try {
		// Find the message in the database that matches the conversation, message, and sender
		const message = await prisma.message.findFirst({
			where: { id: messageId, conversationId, senderId },
			include: {
				conversation: {
					include: { members: { select: { userId: true } } },
				},
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

		// Ensure the message is of type 'text'; if not, return a 422 error (only text messages can be updated)
		if (message.type !== "text") {
			return NextResponse.json(
				{
					success: false,
					message:
						"Only text messages can be updated. This message type is not supported for edits.",
				},
				{ status: 422 }
			);
		}

		// Find the receiver (the other member of the conversation)
		const receiverId = message.conversation.members.find(
			(member) => member.userId !== senderId
		)?.userId;

		// If no receiver is found, respond with 422
		if (!receiverId) {
			return NextResponse.json(
				{
					success: false,
					message:
						"Unable to find a recipient for this conversation. Please ensure you're messaging a valid participant.",
				},
				{ status: 422 }
			);
		}

		// Update the text message content in the database
		const updatedMessage = await prisma.message.update({
			where: { id: message.id },
			data: {
				textMessage: { update: { data: { content: messageContent } } },
			},
			include: MESSAGE_INCLUDE,
		});

		// Format the updated message with relevant data (including who has seen the message)
		const data: CompleteMessage = transformMessageSeenAndStarStatus({
			message: updatedMessage,
			userId: currentUser.id,
		});

		// Trigger a Pusher event to notify the recipient that the message was updated
		pusherServer.trigger(
			generatePrivateChatChannelName({
				conversationId: updatedMessage.conversationId,
				receiverId,
			}),
			conversationEvents.updateMessage,
			data
		);

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
