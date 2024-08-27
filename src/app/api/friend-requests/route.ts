/* eslint-disable import/prefer-default-export */

import { type NextRequest, NextResponse } from "next/server";

import { getUserByUsername } from "@/data/user";
import { getCurrentUser } from "@/data/auth/session";
import { FriendRequestError, sendFriendRequest } from "@/lib/friend-request";

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
	const { friendRequest, error } = await sendFriendRequest({ senderId, receiverId: receiver.id });

	// Handle potential errors based on the returned error type
	if (error) {
		switch (error) {
			case FriendRequestError.AlreadyFriends: {
				return NextResponse.json(
					{ success: false, message: "You are already friends with this user" },
					{ status: 422 }
				);
			}

			case FriendRequestError.PendingIncomingRequest: {
				return NextResponse.json(
					{ success: false, message: "You already have a pending friend request from this user" },
					{ status: 422 }
				);
			}

			case FriendRequestError.RequestAlreadySent: {
				return NextResponse.json(
					{ success: false, message: "You have already sent a friend request to this user" },
					{ status: 422 }
				);
			}

			case FriendRequestError.RequestWasRejected: {
				return NextResponse.json(
					{
						success: false,
						message:
							"Oops! The request didn't go through. Please verify that the username is correct and try again",
					},
					{ status: 422 }
				);
			}

			case FriendRequestError.SenderIsBlocked: {
				return NextResponse.json(
					{
						success: false,
						message:
							"Oops! The request didn't go through. Please verify that the username is correct and try again",
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
