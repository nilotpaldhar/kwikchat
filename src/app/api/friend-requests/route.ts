import type { FriendRequestWithRequestType } from "@/types";
import { type NextRequest, NextResponse } from "next/server";

import { getUserByUsername } from "@/data/user";
import { getCurrentUser } from "@/data/auth/session";
import { getFriendRequests } from "@/data/friend-request";
import {
	SendFriendRequestError,
	broadcastFriendRequest,
	sendFriendRequest,
} from "@/lib/friend-request";

import { friendRequestEvents } from "@/constants/pusher-events";

/**
 * Handler function for retrieving friend requests for the current user.
 *
 * @returns A JSON response containing the status, message, and data of friend requests.
 */
export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const currentUser = await getCurrentUser();

	// Extract query parameters with default values
	const page = searchParams.get("page");
	const pageSize = searchParams.get("page_size");
	const query = searchParams.get("query") ?? "";

	// Check if the current user is authenticated. If not, respond with an unauthorized status.
	if (!currentUser) {
		return NextResponse.json(
			{ success: false, message: "Unauthorized! Access denied" },
			{ status: 401 }
		);
	}

	const data = await getFriendRequests({
		userId: currentUser.id,
		page: page ? parseInt(page, 10) : undefined,
		pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
		query,
	});

	return NextResponse.json({
		success: true,
		message: "List of all friend requests",
		data,
	});
}

/**
 * Handler function to send a friend request.
 *
 * @param req - The incoming request object from Next.js, containing request data.
 * @returns A response object indicating success or failure of the send friend request operation.
 */
export async function POST(req: NextRequest) {
	const body = await req.json();
	const currentUser = await getCurrentUser();

	// Check if the current user is authenticated. If not, respond with an unauthorized status.
	if (!currentUser) {
		return NextResponse.json(
			{ success: false, message: "Unauthorized! Access denied" },
			{ status: 401 }
		);
	}

	// Extract sender ID and receiver username
	const senderId = currentUser.id;
	const receiverUsername = body?.receiverUsername ?? null;

	// Check if the receiver username is provided
	if (!receiverUsername) {
		return NextResponse.json(
			{ success: false, message: "The receiver's username must be provided" },
			{ status: 400 }
		);
	}

	// Check if the receiver username is the same as the current user's username
	if (currentUser.username === receiverUsername) {
		return NextResponse.json(
			{ success: false, message: "You cannot send a friend request to yourself" },
			{ status: 400 }
		);
	}

	// Check if the receiver exists
	const receiver = await getUserByUsername(receiverUsername);
	if (!receiver) {
		return NextResponse.json(
			{
				success: false,
				message: "Receiver username not found. Please check the username and try again",
			},
			{ status: 404 }
		);
	}

	// Attempt to send a friend request
	const { friendRequest, invertedFriendRequest, error } = await sendFriendRequest({
		senderId,
		receiverId: receiver.id,
	});

	// Handle potential errors based on the returned error type
	if (error) {
		switch (error) {
			case SendFriendRequestError.AlreadyFriends: {
				return NextResponse.json(
					{ success: false, message: "You are already friends with this user" },
					{ status: 422 }
				);
			}

			case SendFriendRequestError.PendingIncomingRequest: {
				return NextResponse.json(
					{ success: false, message: "You already have a pending friend request from this user" },
					{ status: 422 }
				);
			}

			case SendFriendRequestError.RequestAlreadySent: {
				return NextResponse.json(
					{ success: false, message: "You have already sent a friend request to this user" },
					{ status: 422 }
				);
			}

			case SendFriendRequestError.RequestWasRejected: {
				return NextResponse.json(
					{
						success: false,
						message:
							"Oops! The request didn't go through. Please verify that the username is correct and try again",
					},
					{ status: 422 }
				);
			}

			case SendFriendRequestError.SenderIsBlockedByReceiver: {
				return NextResponse.json(
					{
						success: false,
						message:
							"Oops! The request didn't go through. Please verify that the username is correct and try again",
					},
					{ status: 422 }
				);
			}

			case SendFriendRequestError.ReceiverIsBlockedBySender: {
				return NextResponse.json(
					{
						success: false,
						message:
							"You cannot send a friend request because you have blocked this user. Please unblock them first to proceed.",
					},
					{ status: 422 }
				);
			}

			default: {
				return NextResponse.json(
					{ success: false, message: "An unexpected error occurred. Please try again later" },
					{ status: 500 }
				);
			}
		}
	}

	// Trigger a Pusher event to notify the receiver about an incoming friend request
	if (invertedFriendRequest) {
		await broadcastFriendRequest<FriendRequestWithRequestType>({
			receiver: receiver.id,
			eventType: "incoming",
			eventName: friendRequestEvents.incoming,
			payload: invertedFriendRequest,
		});
	}

	// If no error, return a success response with the created friend request details
	return NextResponse.json(
		{
			success: true,
			message: `Success! Your friend request to ${receiverUsername} was sent`,
			data: friendRequest,
		},
		{ status: 201 }
	);
}
