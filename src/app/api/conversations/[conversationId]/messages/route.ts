import { type NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";

import { MAX_MESSAGE_CHAR_LENGTH } from "@/constants/chat-input";
import { getCurrentUser } from "@/data/auth/session";
import { isBlocked } from "@/lib/block";
import { areUsersFriends } from "@/lib/friendship";

type Params = { conversationId: string };

/**
 * Handler function for
 *
 * @returns A JSON response containing the status, message, and
 */
export async function GET(req: NextRequest, { params }: { params: Params }) {
	const conversationId = params.conversationId;

	// Retrieve the current user from the session
	const currentUser = await getCurrentUser(true);

	// Check if the current user is authenticated. If not, respond with an unauthorized status.
	if (!currentUser) {
		return NextResponse.json(
			{ success: false, message: "Unauthorized! Access denied" },
			{ status: 401 }
		);
	}

	// Check if conversation and receiver exist
	const conversation = await prisma.conversation.findFirst({
		where: { id: conversationId, members: { some: { userId: currentUser.id } } },
	});
	if (!conversation) {
		return NextResponse.json(
			{ success: false, message: "Conversation not found" },
			{ status: 404 }
		);
	}

	// Get messages
	const messages = await prisma.message.findMany({
		where: { conversationId: conversation.id },
		include: { textMessage: true, imageMessage: true },
		orderBy: { createdAt: "desc" },
	});

	return NextResponse.json({
		success: true,
		data: messages,
	});
}

/**
 * Handler function for
 *
 * @returns A JSON response containing the status, message, and
 */
export async function POST(req: NextRequest, { params }: { params: Params }) {
	const body = await req.json();

	// Retrieve the current user from the session
	const currentUser = await getCurrentUser(true);

	// Check if the current user is authenticated. If not, respond with an unauthorized status.
	if (!currentUser) {
		return NextResponse.json(
			{ success: false, message: "Unauthorized! Access denied" },
			{ status: 401 }
		);
	}

	const senderId = currentUser.id;
	const conversationId = params.conversationId;
	const message = body?.message ?? "";
	const trimmedMessage = typeof message === "string" ? message.trim() : "";

	// Validate message
	if (!trimmedMessage) {
		return NextResponse.json({ success: false, message: "Invalid message" }, { status: 400 });
	}

	if (trimmedMessage.length > MAX_MESSAGE_CHAR_LENGTH) {
		return NextResponse.json({ success: false, message: "Message too long" }, { status: 400 });
	}

	// Check if conversation and receiver exist
	const conversation = await prisma.conversation.findFirst({
		where: { id: conversationId, members: { some: { userId: senderId } } },
		include: { members: true },
	});
	if (!conversation) {
		return NextResponse.json(
			{ success: false, message: "Conversation not found" },
			{ status: 404 }
		);
	}

	const receiverId = conversation.members.filter((member) => member.userId !== senderId)[0].userId;
	if (!receiverId) {
		return NextResponse.json({ success: false, message: "No receiver" }, { status: 404 });
	}

	try {
		// Check if sender is blocked by the receiver
		const blocked = await isBlocked({ blockerId: receiverId, blockedId: senderId });
		if (blocked) {
			return NextResponse.json({ success: false, message: "Sender blocked" }, { status: 422 });
		}

		// Check if sender is fried with the receiver
		const isFriend = await areUsersFriends({ senderId, receiverId });
		if (!isFriend) {
			return NextResponse.json(
				{ success: false, message: "Sender is not friend" },
				{ status: 422 }
			);
		}

		// Create message
		const newMessage = await prisma.message.create({
			data: {
				conversationId,
				senderId,
				type: "text",
				textMessage: {
					create: { content: trimmedMessage },
				},
			},
		});

		return NextResponse.json({
			success: true,
			data: newMessage,
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "An unexpected error occurred. Please try again later" },
			{ status: 500 }
		);
	}
}
