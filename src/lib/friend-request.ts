import "server-only";

import type { FriendRequestWithRelations } from "@/types";

import { subYears, isBefore } from "date-fns";

import { prisma } from "@/lib/db";
import { isBlocked } from "@/lib/block";

export enum FriendRequestError {
	SenderIsBlocked = "SenderIsBlocked",
	AlreadyFriends = "AlreadyFriends",
	PendingIncomingRequest = "PendingIncomingRequest",
	RequestAlreadySent = "RequestAlreadySent",
	RequestWasRejected = "RequestWasRejected",
	UnknownError = "UnknownError",
}

export interface SendFriendRequestResponse {
	friendRequest: FriendRequestWithRelations | null;
	error: FriendRequestError | null;
}

/**
 * Check if a friend request was sent 1 year ago or more
 */
const wasFriendRequestSentLongAgo = (requestDate: Date) => {
	const oneYearAgo = subYears(new Date(), 1);
	const isOld = isBefore(requestDate, oneYearAgo);
	return isOld;
};

/**
 * Send friend request.
 */
const sendFriendRequest = async ({
	senderId,
	receiverId,
}: {
	senderId: string;
	receiverId: string;
}): Promise<SendFriendRequestResponse> => {
	try {
		// Check if sender is blocked by receiver
		const isSenderBlocked = await isBlocked({ blockerId: receiverId, blockedId: senderId });
		if (isSenderBlocked) {
			return { friendRequest: null, error: FriendRequestError.SenderIsBlocked };
		}

		// TODO: Create function to check if sender and receiver is already friend
		const isFriend = false;
		if (isFriend) {
			return { friendRequest: null, error: FriendRequestError.AlreadyFriends };
		}

		// Check if receiver already send a friend request
		const receiverFriendRequest = await prisma.friendRequest.findUnique({
			where: {
				senderId_receiverId: { senderId: receiverId, receiverId: senderId },
			},
		});
		if (receiverFriendRequest && receiverFriendRequest.status === "pending") {
			return { friendRequest: null, error: FriendRequestError.PendingIncomingRequest };
		}

		// Check if sender already send a friend request to the same receiver
		const existingFriendRequest = await prisma.friendRequest.findUnique({
			where: { senderId_receiverId: { senderId, receiverId } },
		});
		if (existingFriendRequest && existingFriendRequest.status === "pending") {
			return { friendRequest: null, error: FriendRequestError.RequestAlreadySent };
		}

		if (existingFriendRequest) {
			// Check if friend request is rejected and its been 1 year or not
			if (
				existingFriendRequest.status === "rejected" &&
				!wasFriendRequestSentLongAgo(existingFriendRequest.createdAt)
			) {
				return { friendRequest: null, error: FriendRequestError.RequestWasRejected };
			}

			// If friend request is rejected and its been 1 year than update the request status
			if (
				existingFriendRequest.status === "rejected" &&
				wasFriendRequestSentLongAgo(existingFriendRequest.createdAt)
			) {
				const updatedFriendRequest = await prisma.friendRequest.update({
					where: { id: existingFriendRequest.id },
					data: { status: "pending", createdAt: new Date() },
					include: { sender: { omit: { password: true } }, receiver: { omit: { password: true } } },
				});

				return { friendRequest: updatedFriendRequest, error: null };
			}
		}

		// Create new friend request
		const friendRequest = await prisma.friendRequest.create({
			data: { senderId, receiverId: receiverId, status: "pending" },
			include: { sender: { omit: { password: true } }, receiver: { omit: { password: true } } },
		});

		return { friendRequest, error: null };
	} catch (error) {
		return { friendRequest: null, error: FriendRequestError.UnknownError };
	}
};

export { sendFriendRequest, wasFriendRequestSentLongAgo };
