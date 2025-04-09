import { type NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/data/auth/session";
import { broadcastFriendRequest, classifyFriendRequest } from "@/lib/friend-request";

import { friendRequestEvents } from "@/constants/pusher-events";

type Params = Promise<{ id: string }>;

/**
 * Handler function to reject a pending friend request by its ID.
 *
 * @returns A JSON response containing the status, message, and data of friend request.
 */
export async function POST(req: NextRequest, segmentData: { params: Params }) {
	const params = await segmentData.params;

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
			where: { id: friendReqId, status: "pending", receiverId: currentUser.id },
			include: { sender: true, receiver: true },
		});

		// Check if the friend request exists. If not, respond with a 404 Not Found status.
		if (!friendRequest) {
			return NextResponse.json(
				{ success: false, message: "Friend request does not exist" },
				{ status: 404 }
			);
		}

		// Update the friend request status to "rejected".
		const updatedFriendRequest = await prisma.friendRequest.update({
			where: { id: friendRequest.id },
			data: { status: "rejected" },
			include: { sender: true, receiver: true },
		});

		// Trigger a Pusher event to notify the sender about a rejected friend request
		broadcastFriendRequest<string>({
			receiver: friendRequest.senderId,
			eventType: "rejected",
			eventName: friendRequestEvents.reject,
			payload: friendRequest.id,
		});

		return NextResponse.json({
			success: true,
			message: "Friend request accepted successfully.",
			data: classifyFriendRequest({
				userId: currentUser.id,
				friendRequest: updatedFriendRequest,
			}),
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "An unexpected error occurred. Please try again later" },
			{ status: 500 }
		);
	}
}
