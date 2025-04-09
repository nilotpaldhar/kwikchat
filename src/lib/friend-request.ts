import "server-only";

import type {
	FriendRequestWithRelations,
	FriendRequestType,
	FriendRequestWithRequestType,
} from "@/types";

import { subYears, isBefore } from "date-fns";

import { prisma } from "@/lib/db";
import { pusherServer } from "@/lib/pusher/server";

import { isBlocked } from "@/lib/block";
import { areUsersFriends } from "@/lib/friendship";

import generateFriendRequestChannel, {
	type FriendRequestStatus,
} from "@/utils/pusher/generate-friend-request-channel";

export enum SendFriendRequestError {
	SenderIsBlockedByReceiver = "SenderIsBlockedByReceiver",
	ReceiverIsBlockedBySender = "ReceiverIsBlockedBySender",
	AlreadyFriends = "AlreadyFriends",
	PendingIncomingRequest = "PendingIncomingRequest",
	RequestAlreadySent = "RequestAlreadySent",
	RequestWasRejected = "RequestWasRejected",
	UnknownError = "UnknownError",
}

export interface FriendRequestResponse<T> {
	friendRequest: FriendRequestWithRequestType | null;
	invertedFriendRequest: FriendRequestWithRequestType | null;
	error: T | null;
}

/**
 * Classifies a friend request as either 'outgoing' or 'incoming' based on the user's ID.
 * It also selectively includes the sender or receiver information depending on the request type.
 */
const classifyFriendRequest = ({
	userId,
	friendRequest,
	invert = false,
}: {
	userId: string;
	friendRequest: FriendRequestWithRelations;
	invert?: boolean;
}): FriendRequestWithRequestType => {
	let requestType: FriendRequestType = friendRequest.senderId === userId ? "outgoing" : "incoming";

	// Invert the requestType if invert is true
	if (invert) requestType = requestType === "outgoing" ? "incoming" : "outgoing";

	const { sender, receiver, ...rest } = friendRequest;
	return {
		...rest,
		requestType,
		sender: requestType === "incoming" ? sender : undefined,
		receiver: requestType === "outgoing" ? receiver : undefined,
	};
};

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
}): Promise<FriendRequestResponse<SendFriendRequestError>> => {
	try {
		// Check if either the sender is blocked by the receiver or the receiver is blocked by the sender
		const [isSenderBlocked, isReceiverBlocked] = await Promise.all([
			isBlocked({ blockerId: receiverId, blockedId: senderId }),
			isBlocked({ blockerId: senderId, blockedId: receiverId }),
		]);

		// Handle the case where the sender is blocked by the receiver
		if (isSenderBlocked) {
			return {
				friendRequest: null,
				invertedFriendRequest: null,
				error: SendFriendRequestError.SenderIsBlockedByReceiver,
			};
		}

		// Handle the case where the receiver is blocked by the sender
		if (isReceiverBlocked) {
			return {
				friendRequest: null,
				invertedFriendRequest: null,
				error: SendFriendRequestError.ReceiverIsBlockedBySender,
			};
		}

		// Check if sender and receiver is already friend
		const isFriend = await areUsersFriends({ senderId, receiverId });
		if (isFriend) {
			return {
				friendRequest: null,
				invertedFriendRequest: null,
				error: SendFriendRequestError.AlreadyFriends,
			};
		}

		// Check if receiver already send a friend request
		const receiverFriendRequest = await prisma.friendRequest.findUnique({
			where: {
				senderId_receiverId: { senderId: receiverId, receiverId: senderId },
			},
		});
		if (receiverFriendRequest && receiverFriendRequest.status === "pending") {
			return {
				friendRequest: null,
				invertedFriendRequest: null,
				error: SendFriendRequestError.PendingIncomingRequest,
			};
		}

		// Check if sender already send a friend request to the same receiver
		const existingFriendRequest = await prisma.friendRequest.findUnique({
			where: { senderId_receiverId: { senderId, receiverId } },
		});
		if (existingFriendRequest && existingFriendRequest.status === "pending") {
			return {
				friendRequest: null,
				invertedFriendRequest: null,
				error: SendFriendRequestError.RequestAlreadySent,
			};
		}

		if (existingFriendRequest) {
			// Check if friend request is rejected and its been 1 year or not
			if (
				existingFriendRequest.status === "rejected" &&
				!wasFriendRequestSentLongAgo(existingFriendRequest.createdAt)
			) {
				return {
					friendRequest: null,
					invertedFriendRequest: null,
					error: SendFriendRequestError.RequestWasRejected,
				};
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

				return {
					friendRequest: classifyFriendRequest({
						userId: senderId,
						friendRequest: updatedFriendRequest,
					}),
					invertedFriendRequest: classifyFriendRequest({
						userId: senderId,
						friendRequest: updatedFriendRequest,
						invert: true,
					}),
					error: null,
				};
			}
		}

		// Create new friend request
		const friendRequest = await prisma.friendRequest.create({
			data: { senderId, receiverId: receiverId, status: "pending" },
			include: { sender: { omit: { password: true } }, receiver: { omit: { password: true } } },
		});

		return {
			friendRequest: classifyFriendRequest({
				userId: senderId,
				friendRequest: friendRequest,
			}),
			invertedFriendRequest: classifyFriendRequest({
				userId: senderId,
				friendRequest: friendRequest,
				invert: true,
			}),
			error: null,
		};
	} catch (error) {
		return {
			friendRequest: null,
			invertedFriendRequest: null,
			error: SendFriendRequestError.UnknownError,
		};
	}
};

/**
 * Broadcasts a friend request event to multiple channels.
 *
 * This function sends a payload to relevant channels based on the friend request status
 * and associated channel types (default, recent, count).
 */
const broadcastFriendRequest = async <FriendRequestPayload>({
	receiver,
	eventType,
	eventName,
	payload,
}: {
	receiver: string;
	eventType: FriendRequestStatus;
	eventName: string;
	payload: FriendRequestPayload;
}) => {
	// Assign receiver and status to meaningful variables for clarity
	const receiverId = receiver;
	const status = eventType;

	// Generate channel names for broadcasting based on the request status and channel types
	const channelNames = [
		generateFriendRequestChannel({ channelType: "default", receiverId, status }),
		generateFriendRequestChannel({ channelType: "recent", receiverId, status }),
		generateFriendRequestChannel({ channelType: "count", receiverId, status }),
	];

	try {
		// Trigger the pusher server to broadcast the event to the generated channels
		await pusherServer.trigger(channelNames, eventName, payload);
	} catch (error) {
		console.error(`Failed to broadcast friend request event: "${eventType}"`);
	}
};

export {
	sendFriendRequest,
	wasFriendRequestSentLongAgo,
	classifyFriendRequest,
	broadcastFriendRequest,
};
