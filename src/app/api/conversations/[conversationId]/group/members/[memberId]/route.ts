import type { CompleteMessage } from "@/types";

import { type NextRequest, NextResponse } from "next/server";
import { SystemMessageEvent } from "@prisma/client";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/data/auth/session";
import { broadcastMemberAction } from "@/lib/member";
import { broadcastConversation } from "@/lib/conversation";
import { broadcastGroupMessage, createSystemMessage } from "@/lib/message";

import { UpdateMemberRoleSchema } from "@/schemas";
import isGroupAdmin from "@/utils/messenger/is-group-admin";
import { conversationEvents, memberEvents } from "@/constants/pusher-events";

type Params = {
	conversationId: string;
	memberId: string;
};

/**
 * Handler function for updating the role of a group member.
 *
 * @returns A JSON response indicating success or failure of the operation.
 */
export async function PATCH(req: NextRequest, { params }: { params: Params }) {
	// Parse the incoming request body
	const body = await req.json();

	// Validate the body against the UpdateMemberRoleSchema
	const validatedFields = UpdateMemberRoleSchema.safeParse(body);
	if (!validatedFields.success) {
		// eslint-disable-next-line no-underscore-dangle
		const errorMessage = validatedFields.error.format().memberRole?._errors[0] ?? "Invalid Fields";
		return NextResponse.json({ success: false, message: errorMessage }, { status: 400 });
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

	// Destructure route parameters
	const { conversationId, memberId } = params;
	const { memberRole } = validatedFields.data;

	try {
		// Find the group conversation that includes the current user
		const conversation = await prisma.conversation.findFirst({
			where: {
				id: conversationId,
				isGroup: true,
				members: { some: { userId: currentUser.id } },
			},
			include: { members: true },
		});

		// If the conversation is not found, respond with a 404 error
		if (!conversation) {
			return NextResponse.json(
				{ success: false, message: "The specified group conversation could not be found." },
				{ status: 404 }
			);
		}

		// Check if the current user is a group admin
		const isAdmin = isGroupAdmin({ members: conversation.members, userId: currentUser.id });
		if (!isAdmin) {
			return NextResponse.json(
				{ success: false, message: "You must be a group admin to perform this action." },
				{ status: 403 }
			);
		}

		// Retrieve the target member by memberId
		const member = await prisma.member.findUnique({
			where: { id: memberId },
		});

		// Validate that the member exists and belongs to the conversation
		if (!member || member.conversationId !== conversation.id) {
			return NextResponse.json(
				{
					success: false,
					message: "The specified member could not be found in this group conversation.",
				},
				{ status: 404 }
			);
		}

		// Check if the current user is attempting to update the role of group creator
		if (conversation.createdBy === member.userId) {
			return NextResponse.json(
				{ success: false, message: "The role of the group creator cannot be changed." },
				{ status: 422 }
			);
		}

		// Update the member's role in the conversation
		const updatedMember = await prisma.member.update({
			where: { id: member.id },
			data: { role: memberRole },
			include: { user: { omit: { password: true } } },
		});

		// Extract relevant information about the deleted member for the response
		const {
			user: { displayName, username },
		} = updatedMember;

		return NextResponse.json({
			success: true,
			message: `Successfully updated ${displayName ? `${displayName}'s` : username} role to "${updatedMember.role}"`,
			data: updatedMember,
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "An unexpected error occurred. Please try again later" },
			{ status: 500 }
		);
	}
}

/**
 * Handler function for the removal of a member from a group conversation
 *
 * @returns A JSON response indicating success or failure of the operation.
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

	// Destructure route parameters
	const { conversationId, memberId } = params;

	try {
		// Find the group conversation that includes the current user
		const conversation = await prisma.conversation.findFirst({
			where: {
				id: conversationId,
				isGroup: true,
				members: { some: { userId: currentUser.id } },
			},
			include: { members: true },
		});

		// If the conversation is not found, respond with a 404 error
		if (!conversation) {
			return NextResponse.json(
				{ success: false, message: "The specified group conversation could not be found." },
				{ status: 404 }
			);
		}

		// Check if the current user is a group admin
		const isAdmin = isGroupAdmin({ members: conversation.members, userId: currentUser.id });
		if (!isAdmin) {
			return NextResponse.json(
				{ success: false, message: "You must be a group admin to perform this action." },
				{ status: 403 }
			);
		}

		// Retrieve the target member by memberId
		const member = await prisma.member.findUnique({
			where: { id: memberId },
		});

		// Validate that the member exists and belongs to the conversation
		if (!member || member.conversationId !== conversation.id) {
			return NextResponse.json(
				{
					success: false,
					message: "The specified member could not be found in this group conversation.",
				},
				{ status: 404 }
			);
		}

		// Check if the current user is attempting to remove the group creator
		if (conversation.createdBy === member.userId) {
			return NextResponse.json(
				{ success: false, message: "The group creator cannot be removed." },
				{ status: 422 }
			);
		}

		// Proceed to delete the member from the conversation
		const deletedMember = await prisma.member.delete({
			where: { id: member.id },
			include: { user: { omit: { password: true } } },
		});

		// Extract relevant information about the deleted member for the response
		const {
			user: { displayName, username },
		} = deletedMember;

		// Create a system message announcing the member's removal
		const message = await createSystemMessage({
			userId: currentUser.id,
			conversationId: conversation.id,
			event: SystemMessageEvent.group_member_removed,
			content: `'${displayName ?? username}' has been removed from the group.`,
		});

		if (message) {
			// Prepare a list of remaining member IDs for notification
			const receiverIds = conversation.members
				.filter((m) => m.userId !== deletedMember.userId)
				.map((m) => m.userId);

			// Broadcast events to update group members about the member removal
			await Promise.all([
				// Notify members of the new system message
				broadcastGroupMessage<CompleteMessage>({
					conversationId: conversation.id,
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

				// Notify members about the member removal action
				broadcastMemberAction<string>({
					conversationId: deletedMember.conversationId,
					receiverIds,
					eventName: memberEvents.remove,
					eventType: "removed",
					payload: deletedMember.id,
				}),
			]);
		}

		return NextResponse.json({
			success: true,
			message: `Successfully removed ${displayName ?? username} from group.`,
			data: undefined,
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "An unexpected error occurred. Please try again later" },
			{ status: 500 }
		);
	}
}
