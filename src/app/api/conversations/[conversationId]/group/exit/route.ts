/* eslint-disable import/prefer-default-export */

import type { CompleteMessage } from "@/types";

import { type NextRequest, NextResponse } from "next/server";
import { SystemMessageEvent } from "@prisma/client";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/data/auth/session";
import { broadcastMemberAction } from "@/lib/member";
import { broadcastConversation } from "@/lib/conversation";
import { createSystemMessage, broadcastGroupMessage } from "@/lib/message";

import { conversationEvents, memberEvents } from "@/constants/pusher-events";

interface Params {
	conversationId: string;
}

/**
 * Handler function for removing a member from a group chat.
 *
 * This function allows the current user to exit a group chat and notifies
 * other group members of the user's exit through various broadcast events.
 *
 * @returns A JSON response indicating success or failure of the operation.
 */
export async function DELETE(req: NextRequest, { params }: { params: Params }) {
	// Retrieve the current user from the session
	const currentUser = await getCurrentUser();

	// Check if the current user is authenticated. If not, respond with an unauthorized status.
	if (!currentUser) {
		return NextResponse.json(
			{ success: false, message: "Unauthorized! Access denied" },
			{ status: 401 }
		);
	}

	const userId = currentUser.id;
	const conversationId = params.conversationId;

	try {
		// Find the group conversation that includes the current user
		const conversation = await prisma.conversation.findFirst({
			where: {
				id: conversationId,
				isGroup: true,
				members: { some: { userId } },
			},
			include: {
				members: true,
				groupDetails: { select: { name: true } },
			},
		});

		// If the conversation is not found, respond with a 404 error
		if (!conversation) {
			return NextResponse.json(
				{ success: false, message: "The specified group conversation could not be found." },
				{ status: 404 }
			);
		}

		// Locate the member ID of the current user in the group conversation
		const memberId = conversation.members.find((member) => member.userId === userId)?.id;
		if (!memberId) {
			return NextResponse.json(
				{ success: false, message: "Membership could not be found." },
				{ status: 404 }
			);
		}

		// Remove the member from the group and fetch the user's details
		const deletedMember = await prisma.member.delete({
			where: { id: memberId },
			include: {
				user: {
					select: {
						displayName: true,
						username: true,
					},
				},
			},
		});

		// Extract the display name or username of the removed member
		const {
			user: { displayName, username },
		} = deletedMember;

		// Create a system message announcing the member's exit
		const message = await createSystemMessage({
			userId: deletedMember.userId,
			conversationId: deletedMember.conversationId,
			event: SystemMessageEvent.group_member_exited,
			content: `'${displayName ?? username}' has left the group.`,
		});

		if (message) {
			// Prepare a list of remaining member IDs for notification
			const receiverIds = conversation.members
				.filter((m) => m.userId !== userId)
				.map((m) => m.userId);

			// Broadcast events to update group members about the exit
			await Promise.all([
				// Notify members of the new system message
				broadcastGroupMessage<CompleteMessage>({
					conversationId: deletedMember.conversationId,
					eventName: conversationEvents.newMessage,
					payload: message,
					receiverIds,
				}),

				// Notify members about the updated conversation
				broadcastConversation<string>({
					receiver: receiverIds,
					eventType: "updated",
					eventName: conversationEvents.updateConversation,
					payload: message.conversationId,
				}),

				// Notify members about the member exit action
				broadcastMemberAction<string>({
					conversationId: deletedMember.conversationId,
					receiverIds,
					eventName: memberEvents.exit,
					eventType: "exit",
					payload: deletedMember.id,
				}),
			]);
		}

		return NextResponse.json({
			success: true,
			message: `You have successfully exited the group ${conversation.groupDetails?.name ?? ""}.`,
			data: undefined,
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "An unexpected error occurred. Please try again later" },
			{ status: 500 }
		);
	}
}
