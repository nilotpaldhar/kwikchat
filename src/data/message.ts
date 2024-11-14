import "server-only";

import type { PaginatedResponse, CompleteMessage, MessageWithUserID } from "@/types";

import { Prisma } from "@prisma/client";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constants/pagination";

import { prisma } from "@/lib/db";
import { isBlocked } from "@/lib/block";
import { areUsersFriends } from "@/lib/friendship";

import { calculatePagination } from "@/utils/general/calculate-pagination";
import transformMessageSeenAndStarStatus from "@/utils/messenger/transform-message-seen-and-star-status";

// Parameters required to fetch messages with pagination.
interface GetMessagesParams {
	conversationId: string;
	userId: string;
	page?: number;
	pageSize?: number;
}

// Enumeration for potential errors that can occur when fetching a user message.
export enum UserMessageError {
	MessageNotFound = "MessageNotFound",
	NotMember = "NotMember",
	NoRecipient = "NoRecipient",
	NotAllowed = "NotAllowed",
	UnknownError = "UnknownError",
}

// The result of attempting to fetch a message by ID for a specific user, including any errors.
export interface GetUserMessageResponse {
	message: MessageWithUserID | null;
	receiverId: string | null;
	error: UserMessageError | null;
}

// Prisma include statement for fetching a complete message with associated data.
export const MESSAGE_INCLUDE = {
	conversation: true,
	textMessage: true,
	imageMessage: true,
	sender: { omit: { password: true, image: true } },
	reactions: { orderBy: { createdAt: "asc" } },
	starred: { select: { userId: true } },
	seenByMembers: {
		include: {
			member: { select: { userId: true } },
		},
	},
} satisfies Prisma.MessageInclude;

/**
 * Fetches messages from the database with pagination.
 */
const getMessagesFromDB = async ({
	conversationId,
	userId,
	page = DEFAULT_PAGE,
	pageSize = DEFAULT_PAGE_SIZE,
}: GetMessagesParams) => {
	// Calculate the offset for pagination
	const skip = (page - 1) * pageSize;
	const take = pageSize;

	// Base where clause to filter messages
	const baseWhereClause: Prisma.MessageWhereInput = {
		conversationId,
		NOT: {
			deleted: { some: { userId } },
		},
	};

	try {
		// Fetch messages and total count from the database
		const [messageList, totalItems] = await Promise.all([
			prisma.message.findMany({
				where: baseWhereClause,
				include: MESSAGE_INCLUDE,
				skip,
				take,
				orderBy: { createdAt: "desc" },
			}),
			prisma.message.count({
				where: baseWhereClause,
			}),
		]);

		return {
			messageList: messageList.map((message) =>
				transformMessageSeenAndStarStatus({ message, userId })
			),
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
	userId,
	page = DEFAULT_PAGE,
	pageSize = DEFAULT_PAGE_SIZE,
}: GetMessagesParams): Promise<PaginatedResponse<CompleteMessage>> => {
	const { messageList, totalItems } = await getMessagesFromDB({
		conversationId,
		userId,
		page,
		pageSize,
	});
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
				error: UserMessageError.MessageNotFound,
			};
		}

		// Check if the user is a member of the conversation
		const isMember = message.conversation.members.some((members) => members.userId === userId);
		if (!isMember) {
			return {
				message: null,
				receiverId: null,
				error: UserMessageError.NotMember,
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
				error: UserMessageError.NoRecipient,
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
				error: UserMessageError.NotAllowed,
			};
		}

		return { message, receiverId, error: null };
	} catch (error) {
		return {
			message: null,
			receiverId: null,
			error: UserMessageError.UnknownError,
		};
	}
};

export { getMessagesFromDB, getMessages, getUserMessage };
