/* eslint-disable import/prefer-default-export */

import { type NextRequest, NextResponse } from "next/server";

import { SeenMessageSchema } from "@/schemas";

import { prisma } from "@/lib/db";
import {
	updateMessageSeenStatus,
	broadcastPrivateMessage,
	broadcastGroupMessage,
} from "@/lib/message";
import { getCurrentUser } from "@/data/auth/session";

import { conversationEvents } from "@/constants/pusher-events";

type Params = { conversationId: string };

/**
 * Handler function for processing seen message status updates.
 *
 * @returns A JSON response indicating the success or failure of the operation.
 */
export async function POST(req: NextRequest, { params }: { params: Params }) {
	const body = await req.json();

	// Validate the incoming data against the SeenMessageSchema
	const validatedFields = SeenMessageSchema.safeParse(body);
	if (!validatedFields.success) {
		return NextResponse.json(
			{ success: false, message: "Please provide the message IDs to proceed with the operation." },
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

	const currentUserId = currentUser.id; // Get the current user's ID
	const conversationId = params.conversationId; // Extract the conversation ID from params
	const messageIds = validatedFields.data.messageIds; // Get message IDs from validated data

	try {
		// Find the conversation, ensuring the current user is a member of it
		const conversation = await prisma.conversation.findFirst({
			where: { id: conversationId, members: { some: { userId: currentUserId } } },
			include: { members: true },
		});

		// If the conversation is not found, return a 404 response
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

		// Identify the current user and another member in the conversation
		const currentMember = conversation.members.find((member) => member.userId === currentUserId);
		const otherMember = conversation.members.find((member) => member.userId !== currentUserId);

		// Ensure both members exist; return a 422 response if not
		if (!currentMember || !otherMember) {
			return NextResponse.json(
				{ success: false, message: "Member IDs do not match the expected values." },
				{ status: 422 }
			);
		}

		// Update the seen status of the messages for the current member
		const data = await updateMessageSeenStatus({ messageIds, memberId: currentMember.id });

		// If any messages were updated, proceed with broadcasting seen status
		if (data.length > 0) {
			// Set the event name for broadcasting a seen message
			const eventName = conversationEvents.seenMessage;

			// Collect the IDs of all members in the conversation to use as recipients for the broadcast
			const receiverIds = conversation.members.map((member) => member.userId);

			// Check if the conversation is a group chat
			if (conversation.isGroup) {
				// Broadcast the seen message event to all group members with relevant payload
				await broadcastGroupMessage({
					conversationId: conversation.id,
					eventName,
					receiverIds,
					payload: data,
				});
			} else {
				// For a private conversation, broadcast the seen message event to the other participant only
				await broadcastPrivateMessage({
					conversationId: conversation.id,
					eventName,
					receiverId: otherMember.userId,
					payload: data,
				});
			}
		}

		return NextResponse.json({
			success: true,
			message: "Successfully updated the seen status of the messages.",
			data,
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "An unexpected error occurred. Please try again later" },
			{ status: 500 }
		);
	}
}
