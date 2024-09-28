import { type NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";

import { pusherServer } from "@/lib/pusher/server";
import { conversationEvents } from "@/constants/pusher-events";

import { getCurrentUser } from "@/data/auth/session";
import { getMessages } from "@/data/message";

import { isBlocked } from "@/lib/block";
import { areUsersFriends } from "@/lib/friendship";

import { MAX_MESSAGE_CHAR_LENGTH } from "@/constants/chat-input";
import { generatePrivateChatChannelName } from "@/utils/pusher/generate-chat-channel-name";

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
	const conversation = await prisma.conversation.findFirst({
		where: { id: conversationId, members: { some: { userId: currentUser.id } } },
	});

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

	// Retrieve the current user from the session (with authentication required)
	const currentUser = await getCurrentUser(true);

	// Check if the current user is authenticated. If not, respond with an unauthorized status.
	if (!currentUser) {
		return NextResponse.json(
			{ success: false, message: "Unauthorized! Access denied" },
			{ status: 401 }
		);
	}

	// Set variables for sender and conversation details
	const senderId = currentUser.id;
	const conversationId = params.conversationId;
	const message = body?.message ?? "";
	const trimmedMessage = typeof message === "string" ? message.trim() : "";

	// Validate the message (ensure it's not empty or too long)
	if (!trimmedMessage) {
		return NextResponse.json(
			{
				success: false,
				message: "The message cannot be empty or invalid. Please enter a valid message.",
			},
			{ status: 400 }
		);
	}

	if (trimmedMessage.length > MAX_MESSAGE_CHAR_LENGTH) {
		return NextResponse.json(
			{
				success: false,
				message:
					"Your message exceeds the maximum allowed length. Please shorten it and try again.",
			},
			{ status: 400 }
		);
	}

	// Find the conversation, ensuring the current user is a member
	const conversation = await prisma.conversation.findFirst({
		where: { id: conversationId, members: { some: { userId: senderId } } },
		include: { members: true },
	});

	// Respond with 404 if the conversation is not found or the user is not a member
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

	// Find the receiver (the other member of the conversation)
	const receiverId = conversation.members.find((member) => member.userId !== senderId)?.userId;

	// If no receiver is found, respond with 404
	if (!receiverId) {
		return NextResponse.json(
			{
				success: false,
				message:
					"Unable to find a recipient for this conversation. Please ensure you're messaging a valid participant.",
			},
			{ status: 404 }
		);
	}

	try {
		// Check if the sender is blocked by the receiver
		const blocked = await isBlocked({ blockerId: receiverId, blockedId: senderId });
		if (blocked) {
			return NextResponse.json(
				{
					success: false,
					message:
						"You are unable to send a message to this recipient at the moment. Please check your connection or try again later.",
				},
				{ status: 422 }
			);
		}

		// Check if the sender and receiver are friends
		const isFriend = await areUsersFriends({ senderId, receiverId });
		if (!isFriend) {
			return NextResponse.json(
				{
					success: false,
					message:
						"You can only send messages to users who are your friends. Please add this user as a friend to start messaging.",
				},
				{ status: 422 }
			);
		}

		// Create the new message in the conversation
		const newMessage = await prisma.message.create({
			data: {
				conversationId,
				senderId,
				type: "text",
				textMessage: {
					create: { content: trimmedMessage },
				},
			},
			include: { textMessage: true, imageMessage: true },
		});

		// Trigger a Pusher event to notify the receiver about an incoming message
		pusherServer.trigger(
			generatePrivateChatChannelName({ conversationId: newMessage.conversationId, receiverId }),
			conversationEvents.newMessage,
			newMessage
		);

		return NextResponse.json({
			success: true,
			message: "Your message has been sent successfully!",
			data: newMessage,
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "An unexpected error occurred. Please try again later" },
			{ status: 500 }
		);
	}
}
