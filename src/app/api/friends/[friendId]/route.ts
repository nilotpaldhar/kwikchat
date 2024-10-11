import { type NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { pusherServer } from "@/lib/pusher/server";
import { friendEvents } from "@/constants/pusher-events";
import { getCurrentUser } from "@/data/auth/session";
import { deleteFriendship } from "@/lib/friendship";

type Params = { friendId: string };

/**
 * Handler function to retrieve friend details.
 *
 * @returns A JSON response containing the status, message, and friend.
 */
export async function GET(req: NextRequest, { params }: { params: Params }) {
	// Extract the friend ID from the request parameters.
	const friendId = params.friendId;

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
		// Find the friendship relationship between the current user and the specified friend.
		const friendship = await prisma.friendship.findFirst({
			where: {
				OR: [
					{ userId: currentUser.id, friendId: friendId },
					{ userId: friendId, friendId: currentUser.id },
				],
			},
			include: {
				user: { omit: { password: true } },
				friend: { omit: { password: true } },
			},
		});

		// Check if the friendship exists.
		if (!friendship) {
			return NextResponse.json(
				{ success: false, message: "The specified friend could not be found." },
				{ status: 404 }
			);
		}

		// Determine the other user in the friendship and prepare the response data.
		const { friend, user, ...friendshipDetails } = friendship;
		const otherUser = friendship.userId === currentUser.id ? friend : user;
		const data = { ...otherUser, friendship: { ...friendshipDetails } };

		return NextResponse.json({
			success: true,
			message: "Friend details have been successfully retrieved.",
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
 * Handler function to remove a friend from cuurent user friend list.
 *
 * @returns A JSON response containing the status and message.
 */
export async function DELETE(req: NextRequest, { params }: { params: Params }) {
	// Extract the friend ID from the request parameters.
	const friendId = params.friendId;

	// Retrieve the current user from the session
	const currentUser = await getCurrentUser();

	// Check if the current user is authenticated. If not, respond with an unauthorized status.
	if (!currentUser) {
		return NextResponse.json(
			{ success: false, message: "Unauthorized! Access denied" },
			{ status: 401 }
		);
	}

	const deletedFriendship = await deleteFriendship({ userId: currentUser.id, friendId });

	// Check if the deletion was successful.
	if (!deletedFriendship) {
		return NextResponse.json(
			{ success: false, message: "Unable to remove friend. Please try again later." },
			{ status: 400 }
		);
	}

	// Trigger a Pusher event to notify the friend about the deletion of a friendship.
	pusherServer.trigger(friendId, friendEvents.delete, currentUser.id);

	return NextResponse.json({
		success: true,
		message: "Friend has been successfully removed.",
	});
}
