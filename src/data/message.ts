import "server-only";

import type { PaginatedResponse, CompleteMessage, MessageWithUserID } from "@/types";

import { prisma } from "@/lib/db";
import { isBlocked } from "@/lib/block";
import { areUsersFriends } from "@/lib/friendship";
import { calculatePagination } from "@/utils/general/calculate-pagination";

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constants/pagination";

interface Params {
	conversationId: string;
	page?: number;
	pageSize?: number;
}

export enum GetUserMessageError {
	MessageNotFound = "MessageNotFound",
	NotMember = "NotMember",
	NoRecipient = "NoRecipient",
	NotAllowed = "NotAllowed",
	UnknownError = "UnknownError",
}

export interface GetUserMessageResponse {
	message: MessageWithUserID | null;
	receiverId: string | null;
	error: GetUserMessageError | null;
}

/**
 * Fetches messages from the database with pagination.
 */
const getMessagesFromDB = async ({
	conversationId,
	page = DEFAULT_PAGE,
	pageSize = DEFAULT_PAGE_SIZE,
}: Params) => {
	// Calculate the offset for pagination
	const skip = (page - 1) * pageSize;
	const take = pageSize;

	try {
		// Fetch messages and total count from the database
		const [messageList, totalItems] = await Promise.all([
			prisma.message.findMany({
				where: { conversationId },
				include: {
					textMessage: true,
					imageMessage: true,
					reactions: { orderBy: { createdAt: "asc" } },
					seenByMembers: {
						include: {
							member: { select: { userId: true } },
						},
					},
				},
				skip,
				take,
				orderBy: { createdAt: "desc" },
			}),
			prisma.message.count({
				where: { conversationId },
			}),
		]);

		return {
			messageList: messageList.map((message) => ({
				...message,
				seenByMembers: message.seenByMembers.map((seenBy) => seenBy.member.userId),
			})),
			totalItems,
		};
	} catch (error) {
		return { messageList: [], totalItems: 0 };
	}
};

/**
 * Fetches messages with pagination.
 */
const getMessages = async ({
	conversationId,
	page = DEFAULT_PAGE,
	pageSize = DEFAULT_PAGE_SIZE,
}: Params): Promise<PaginatedResponse<CompleteMessage>> => {
	const { messageList, totalItems } = await getMessagesFromDB({ conversationId, page, pageSize });
	const paginationMetadata = calculatePagination({ page, pageSize, totalItems });

	return {
		pagination: paginationMetadata,
		items: messageList,
	};
};

/**
 * Fetches a message by its ID and conversation ID, ensuring the user is a member
 * of the conversation and verifying other conditions like blocking and friendship.
 */
const getUserMessage = async ({
	messageId,
	conversationId,
	userId,
}: {
	messageId: string;
	conversationId: string;
	userId: string;
}): Promise<GetUserMessageResponse> => {
	try {
		// Fetch the message and include the members of the conversation to check user membership
		const message = await prisma.message.findFirst({
			where: { id: messageId, conversationId },
			include: {
				conversation: {
					include: {
						members: { select: { userId: true } },
					},
				},
			},
		});

		// Return an error if the message is not found
		if (!message) {
			return {
				message: null,
				receiverId: null,
				error: GetUserMessageError.MessageNotFound,
			};
		}

		// Check if the user is a member of the conversation
		const isMember = message.conversation.members.some((members) => members.userId === userId);
		if (!isMember) {
			return {
				message: null,
				receiverId: null,
				error: GetUserMessageError.NotMember,
			};
		}

		// Identify the recipient of the message (the other member of the conversation)
		const receiverId = message.conversation.members.find(
			(member) => member.userId !== userId
		)?.userId;

		// Return an error if no recipient is found
		if (!receiverId) {
			return {
				message: null,
				receiverId: null,
				error: GetUserMessageError.NoRecipient,
			};
		}

		// Check if the user is blocked by the recipient or if they are friends
		const [isUserBlocked, isFriend] = await Promise.all([
			isBlocked({ blockedId: userId, blockerId: receiverId }),
			areUsersFriends({ senderId: userId, receiverId }),
		]);

		// Return an error if the user is blocked or not a friend
		if (isUserBlocked || !isFriend) {
			return {
				message: null,
				receiverId: null,
				error: GetUserMessageError.NotAllowed,
			};
		}

		return { message, receiverId, error: null };
	} catch (error) {
		return {
			message: null,
			receiverId: null,
			error: GetUserMessageError.UnknownError,
		};
	}
};

export { getMessagesFromDB, getMessages, getUserMessage };
