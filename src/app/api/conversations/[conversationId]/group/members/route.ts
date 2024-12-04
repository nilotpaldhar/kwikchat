import { type NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { addGroupConversationMembers, AddGroupConversationMemberError } from "@/lib/conversation";

import { getCurrentUser } from "@/data/auth/session";
import { getGroupMembers } from "@/data/member";
import { getUserConversation } from "@/data/conversation";

import { AddGroupMemberSchema } from "@/schemas";
import isGroupAdmin from "@/utils/messenger/is-group-admin";

type Params = { conversationId: string };

/**
 * Handler function to fetch members of a group conversation.
 *
 * @returns A JSON response containing the list of group members or an error message.
 */
export async function GET(req: NextRequest, { params }: { params: Params }) {
	// Extract the conversation ID from route parameters
	const conversationId = params.conversationId;

	// Parse query parameters for pagination, providing defaults if not specified
	const searchParams = req.nextUrl.searchParams;
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

	// Verify the conversation's existence and the user's membership
	const conversation = await getUserConversation({ conversationId, userId: currentUser.id });

	// Respond with a 404 status if the conversation is not found or the user is not a member
	if (!conversation) {
		return NextResponse.json(
			{
				success: false,
				message: "Conversation not found. Please verify your access or the conversation ID.",
			},
			{ status: 404 }
		);
	}

	// Fetch group members with pagination
	const data = await getGroupMembers({
		conversationId: conversation.id,
		page: page ? parseInt(page, 10) : undefined,
		pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
	});

	return NextResponse.json({
		success: true,
		message: "Group members retrieved successfully.",
		data,
	});
}

/**
 * Handler function for adding members to a group conversation.
 *
 * @returns A JSON response indicating success or failure of the operation.
 */
export async function POST(req: NextRequest, { params }: { params: Params }) {
	// Parse the incoming request body
	const body = await req.json();

	// Validate the request body using the AddGroupMemberSchema
	const validatedFields = AddGroupMemberSchema.safeParse(body);
	if (!validatedFields.success) {
		const errorMessage =
			// eslint-disable-next-line no-underscore-dangle
			validatedFields.error.format().userIdsToAdd?._errors[0] ?? "Invalid Fields";
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

	// Extract conversation ID from route parameters and validated user IDs from the request body
	const { conversationId } = params;
	const { userIdsToAdd } = validatedFields.data;

	try {
		// Fetch the group conversation that includes the current user
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

		// Attempt to add the new members to the group conversation
		const { error } = await addGroupConversationMembers({
			conversationId: conversation.id,
			userId: currentUser.id,
			userIdsToAdd,
		});

		// Handle potential errors from adding members
		if (error) {
			switch (error) {
				case AddGroupConversationMemberError.InvalidFriendship:
					return NextResponse.json(
						{
							success: false,
							message:
								"Only your friends can be added as group members. Please select friends to include in the group.",
						},
						{ status: 400 }
					);
				default:
					return NextResponse.json(
						{ success: false, message: "An unexpected error occurred. Please try again later" },
						{ status: 500 }
					);
			}
		}

		return NextResponse.json({
			success: true,
			message: "Group members addedd successfully.",
			data: undefined,
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "An unexpected error occurred. Please try again later" },
			{ status: 500 }
		);
	}
}
