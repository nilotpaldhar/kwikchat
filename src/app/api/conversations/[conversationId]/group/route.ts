import type { Media } from "@prisma/client";
import type { GroupOverview } from "@/types";

import { type NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { uploadAndUpdateGroupConversationIcon } from "@/lib/conversation";
import { getCurrentUser } from "@/data/auth/session";

import { UpdateGroupSchema } from "@/schemas";

type Params = { conversationId: string };

/**
 * Handler function for retrieving group conversation details.
 *
 * @returns A JSON response containing the group conversation details.
 */
export async function GET(req: NextRequest, { params }: { params: Params }) {
	// Extract the conversation ID from the request parameters.
	const conversationId = params.conversationId;

	// Retrieve the current user from the session
	const currentUser = await getCurrentUser();

	// Check if the current user is authenticated. If not, respond with an unauthorized status.
	if (!currentUser) {
		return NextResponse.json(
			{ success: false, message: "Unauthorized! Access denied" },
			{ status: 401 }
		);
	}

	try {
		// Execute a database transaction to fetch conversation details and member counts.
		const groupDetailsResult = await prisma.$transaction(async (prismaClient) => {
			// Fetch the group conversation details if the user is a member.
			const conversation = await prismaClient.conversation.findFirst({
				where: {
					isGroup: true,
					id: conversationId,
					members: { some: { userId: currentUser.id } },
				},
				include: {
					creator: { omit: { password: true } },
					groupDetails: {
						select: {
							name: true,
							description: true,
							bannerColor: true,
							icon: { select: { url: true } },
						},
					},
				},
			});

			// If the group conversation is not found, return null.
			if (!conversation) return null;

			// Count the total number of members in the conversation.
			const totalMembers = await prismaClient.member.count({
				where: { conversationId: conversation.id },
			});

			// Count the number of online members in the conversation.
			const totalMembersOnline = await prismaClient.member.count({
				where: { conversationId: conversation.id, user: { isOnline: true } },
			});

			return { conversation, totalMembers, totalMembersOnline };
		});

		// If the group conversation does not exist, respond with a 404 error.
		if (!groupDetailsResult) {
			return NextResponse.json(
				{ success: false, message: "The specified conversation could not be found." },
				{ status: 404 }
			);
		}

		// Destructure the response data for easier access.
		const { conversation, totalMembers, totalMembersOnline } = groupDetailsResult;

		// Construct the response data in the GroupOverview format.
		const data: GroupOverview = {
			id: conversation.id,
			name: conversation.groupDetails?.name ?? "",
			description: conversation.groupDetails?.description,
			bannerColor: conversation.groupDetails?.bannerColor,
			createdAt: conversation.createdAt,
			icon: conversation.groupDetails?.icon?.url ?? null,
			creator: conversation.creator,
			members: {
				total: totalMembers,
				online: totalMembersOnline,
			},
		};

		return NextResponse.json({
			success: true,
			message: "Group conversation details retrieved successfully.",
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
 * Handler function for updating a group conversation.
 *
 * @returns A JSON response indicating success or failure of the operation.
 */
export async function PATCH(req: NextRequest, { params }: { params: Params }) {
	// Parse the incoming request body
	const body = await req.json();

	// Validate the body against the UpdateGroupSchema
	const validatedFields = UpdateGroupSchema.safeParse(body);
	if (!validatedFields.success) {
		// Combine all error messages into a single string
		const errorMessage = validatedFields.error.issues.map((issue) => `${issue.message}`).join("\n");
		return NextResponse.json({ success: false, message: errorMessage }, { status: 400 });
	}

	// Retrieve the current user from the session
	const currentUser = await getCurrentUser();

	// Check if the current user is authenticated. If not, respond with an unauthorized status.
	if (!currentUser) {
		return NextResponse.json(
			{ success: false, message: "Unauthorized! Access denied" },
			{ status: 401 }
		);
	}

	const conversationId = params.conversationId;
	const { groupName, groupDescription, groupBannerColor, groupIcon } = validatedFields.data;

	try {
		// Execute a database transaction to fetch conversation details and member counts.
		const groupDetailsResult = await prisma.$transaction(async (prismaClient) => {
			// Fetch the group conversation details if the user is a member.
			const conversation = await prismaClient.conversation.findFirst({
				where: {
					isGroup: true,
					id: conversationId,
					members: { some: { userId: currentUser.id } },
				},
				include: {
					creator: { omit: { password: true } },
					groupDetails: {
						include: { icon: true },
					},
				},
			});

			// If the group conversation is not found, return null.
			if (!conversation) return null;

			// Count the total number of members in the conversation.
			const totalMembers = await prismaClient.member.count({
				where: { conversationId: conversation.id },
			});

			// Count the number of online members in the conversation.
			const totalMembersOnline = await prismaClient.member.count({
				where: { conversationId: conversation.id, user: { isOnline: true } },
			});

			return { conversation, totalMembers, totalMembersOnline };
		});

		if (!groupDetailsResult) {
			return NextResponse.json(
				{ success: false, message: "The specified conversation could not be found." },
				{ status: 404 }
			);
		}

		let groupDetailsMedia: Media | null = null;
		const { conversation, totalMembers, totalMembersOnline } = groupDetailsResult;

		// Upload and update the group icon if provided
		if (groupIcon) {
			groupDetailsMedia = await uploadAndUpdateGroupConversationIcon({
				groupIcon,
				conversationId: conversation.id,
				userId: conversation.creator.id,
				mediaId: conversation.groupDetails?.icon?.id,
				mediaExternalId: conversation.groupDetails?.icon?.externalId,
			});
		}

		// Update group details with the new icon and other provided data
		const updatedGroupDetails = await prisma.groupDetails.update({
			where: {
				id: conversation.groupDetails?.id,
			},
			data: {
				name: groupName ?? conversation.groupDetails?.name,
				description: groupDescription ?? conversation.groupDetails?.description,
				bannerColor: groupBannerColor ?? conversation.groupDetails?.bannerColor,
				iconId: groupDetailsMedia?.id ?? conversation.groupDetails?.iconId,
			},
		});

		// Construct the response data in the GroupOverview format.
		const data: GroupOverview = {
			id: conversation.id,
			name: updatedGroupDetails.name,
			description: updatedGroupDetails.description,
			bannerColor: updatedGroupDetails.bannerColor,
			createdAt: conversation.createdAt,
			icon: conversation.groupDetails?.icon?.url ?? null,
			creator: conversation.creator,
			members: {
				total: totalMembers,
				online: totalMembersOnline,
			},
		};

		return NextResponse.json({
			success: true,
			message: `Successfully updated group conversation.`,
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
 * Handler function for deleting a group conversation.
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

		// Check if the user is the group creator
		if (userId !== conversation.createdBy) {
			return NextResponse.json(
				{ success: false, message: "Only the group creator can delete the group." },
				{ status: 403 }
			);
		}

		// Check if there are multiple members remaining in the conversation before allowing the group to be deleted.
		const hasMultipleMembers = conversation.members.filter((m) => m.userId !== userId).length >= 1;
		if (hasMultipleMembers) {
			return NextResponse.json(
				{ success: false, message: "Please remove all members before deleting the group." },
				{ status: 403 }
			);
		}

		// Proceed to delete the conversation
		await prisma.conversation.delete({
			where: { id: conversation.id },
		});

		const groupName = conversation.groupDetails?.name;

		return NextResponse.json({
			success: true,
			message: groupName
				? `The '${groupName}' group has been successfully deleted.`
				: `The group has been successfully deleted.`,
			data: undefined,
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "An unexpected error occurred. Please try again later" },
			{ status: 500 }
		);
	}
}
