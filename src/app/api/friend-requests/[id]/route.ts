import { type NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/data/auth/session";
import { broadcastFriendRequest } from "@/lib/friend-request";

import { friendRequestEvents } from "@/constants/pusher-events";

type Params = Promise<{ id: string }>;

/**
 * Handler function to remove a pending friend request by its ID.
 *
 * @returns A JSON response containing the status and message.
 */
export async function DELETE(req: NextRequest, segmentData: { params: Params }) {
	const params = await segmentData.params;

	// Extract the friend request ID from the request parameters.
	const friendReqId = params.id;
	const currentUser = await getCurrentUser();

	// Check if the current user is authenticated. If not, respond with an unauthorized status.
	if (!currentUser) {
		return NextResponse.json(
			{ success: false, message: "Unauthorized! Access denied" },
			{ status: 401 }
		);
	}

	try {
		// Find the specific pending friend request sent by the current user.
		const friendRequest = await prisma.friendRequest.findUnique({
			where: { id: friendReqId, status: "pending", senderId: currentUser.id },
			include: { sender: true, receiver: true },
		});

		// Check if the friend request exists. If not, respond with a 404 Not Found status.
		if (!friendRequest) {
			return NextResponse.json(
				{ success: false, message: "Friend request does not exist" },
				{ status: 404 }
			);
		}

		// Delete the friend request from the database.
		await prisma.friendRequest.delete({
			where: { id: friendRequest.id },
		});

		// Trigger a Pusher event to notify the receiver about the deletion of a friend request
		broadcastFriendRequest<string>({
			receiver: friendRequest.receiverId,
			eventType: "deleted",
			eventName: friendRequestEvents.delete,
			payload: friendRequest.id,
		});

		return NextResponse.json({
			success: true,
			message: "Friend request deleted successfully.",
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "An unexpected error occurred. Please try again later" },
			{ status: 500 }
		);
	}
}
