import { type NextRequest, NextResponse } from "next/server";
import type { CompleteMessage } from "@/types";

import { TextMessageSchema } from "@/schemas";

import { prisma } from "@/lib/db";

import {
	sendPrivateMessage,
	sendGroupMessage,
	broadcastPrivateMessage,
	broadcastGroupMessage,
} from "@/lib/message";
import { broadcastConversation } from "@/lib/conversation";

import { getMessages } from "@/data/message";
import { getCurrentUser } from "@/data/auth/session";
import { getUserConversation } from "@/data/conversation";

import { conversationEvents } from "@/constants/pusher-events";
import {
	handleSendPrivateMessageError,
	handleSendGroupMessageError,
} from "@/utils/api/handle-send-message-error";

type Params = { conversationId: string };

/**
 * Handler function for retrieving messages from a conversation.
 *
 * @returns A JSON response containing the status, message, and data (if successful).
 */
export async function GET(req: NextRequest, { params }: { params: Params }) {
	// Extract query parameters from the URL for pagination
	const searchParams = req.nextUrl.searchParams;
	const conversationId = params.conversationId;

	// Extract query parameters with default values
	const page = searchParams.get("page");
	const pageSize = searchParams.get("page_size");

	// Retrieve the current user from the session (with authentication required)
	const currentUser = await getCurrentUser(true);

	// Check if the current user is authenticated. If not, respond with an unauthorized status.
	if (!currentUser) {
		return NextResponse.json(
			{ success: false, message: "Unauthorized! Access denied" },
			{ status: 401 }
		);
	}

	// Check if the conversation exists and if the user is a member of it
	const conversation = await getUserConversation({ conversationId, userId: currentUser.id });

	// If the conversation is not found or the user is not a member, respond with a 404 status
	if (!conversation) {
		return NextResponse.json(
			{
				success: false,
				message: "Conversation not found. Please verify your access or the conversation ID.",
			},
			{ status: 404 }
		);
	}

	// Fetch paginated messages for the conversation
	const data = await getMessages({
		conversationId: conversation.id,
		userId: currentUser.id,
		page: page ? parseInt(page, 10) : undefined,
		pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
	});

	return NextResponse.json({
		success: true,
		message: "List of all messages",
		data,
	});
}

/**
 * Handler function for posting a new message in a conversation.
 *
 * @returns A JSON response indicating the success or failure of the message posting.
 */
export async function POST(req: NextRequest, { params }: { params: Params }) {
	// Parse the request body to extract the message content
	const body = await req.json();

	// Validate the incoming message content against the TextMessageSchema
	const validatedFields = TextMessageSchema.safeParse(body);
	if (!validatedFields.success) {
		// If validation fails, return a 400 error with the first validation error or a default message
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

	// Set variables for the sender's ID, the conversation ID from params, and the validated message content
	const senderId = currentUser.id;
	const conversationId = params.conversationId;
	const messageContent = validatedFields.data.message;

	try {
		// Attempt to find the conversation, ensuring that the current user is a member
		const conversation = await prisma.conversation.findFirst({
			where: { id: conversationId, members: { some: { userId: senderId } } },
			include: { members: true },
		});

		// If the conversation is not found or the user is not a member, return a 404 error
		if (!conversation) {
			return NextResponse.json(
				{
					success: false,
					message:
						"The conversation you're trying to access could not be found. Please verify the conversation ID or check your membership.",
				},
				{ status: 404 }
			);
		}

		// Handle sending a group message if the conversation is marked as a group
		if (conversation.isGroup) {
			const { message, receiverIds, error } = await sendGroupMessage({
				conversation,
				messageContent,
				senderId,
			});

			// If there was an error while sending the message, handle it and respond accordingly
			if (error) return handleSendGroupMessageError(error);

			// Broadcast the new message to all group members except the sender, if there are valid recipients
			if (message && receiverIds.length > 0) {
				await Promise.all([
					broadcastGroupMessage<CompleteMessage>({
						conversationId: message.conversationId,
						eventName: conversationEvents.newMessage,
						payload: message,
						receiverIds,
					}),
					broadcastConversation<string>({
						receiver: receiverIds,
						eventType: "updated",
						eventName: conversationEvents.updateConversation,
						payload: message.conversationId,
					}),
				]);
			}

			// Respond with success and the sent message data
			return NextResponse.json({
				success: true,
				message: "Your message has been sent successfully!",
				data: message,
			});
		}

		// Attempt to send a private message in non-group conversations
		const { message, receiverId, error } = await sendPrivateMessage({
			conversation,
			messageContent,
			senderId,
		});

		// Handle any errors that occurred while sending the private message
		if (error) return handleSendPrivateMessageError(error);

		// Broadcast the private message to the receiver if a valid receiver ID was provided
		if (message && receiverId) {
			await Promise.all([
				broadcastPrivateMessage<CompleteMessage>({
					conversationId: message.conversationId,
					eventName: conversationEvents.newMessage,
					payload: message,
					receiverId,
				}),
				broadcastConversation<string>({
					receiver: receiverId,
					eventType: "updated",
					eventName: conversationEvents.updateConversation,
					payload: message.conversationId,
				}),
			]);
		}

		// Respond with success and the sent message data
		return NextResponse.json({
			success: true,
			message: "Your message has been sent successfully!",
			data: message,
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "An unexpected error occurred. Please try again later" },
			{ status: 500 }
		);
	}
}
