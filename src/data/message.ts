import "server-only";

import type { PaginatedResponse, CompleteMessage, MessageWithUserID } from "@/types";

import { Prisma } from "@prisma/client";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constants/pagination";

import { prisma } from "@/lib/db";
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
	receiverIds: string[];
	error: UserMessageError | null;
}

// Prisma include statement for fetching a complete message with associated data.
export const MESSAGE_INCLUDE = {
	conversation: true,
	textMessage: true,
	imageMessage: true,
	systemMessage: true,
	documentMessage: true,
	sender: { omit: { password: true, image: true } },
	reactions: { orderBy: { createdAt: "asc" } },
	starred: { select: { userId: true } },
	seenByMembers: {
		include: {
			member: { select: { userId: true } },
		},
	},
} satisfies Prisma.MessageInclude;

// Prisma include statement for fetching a recent message with associated data.
export const RECENT_MESSAGE_INCLUDE = {
	textMessage: true,
	imageMessage: true,
	systemMessage: true,
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
 * of the conversation and verifying other conditions like friendship, etc.
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
	let receiverId = null;
	let receiverIds: string[] = [];

	try {
		// Fetch the message, including conversation members to validate user membership
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

		// Handle case where the message is not found
		if (!message) {
			return {
				message: null,
				receiverId: null,
				receiverIds: [],
				error: UserMessageError.MessageNotFound,
			};
		}

		// Verify if the requesting user is a member of the conversation
		const isMember = message.conversation.members.some((members) => members.userId === userId);
		if (!isMember) {
			return {
				message: null,
				receiverId: null,
				receiverIds: [],
				error: UserMessageError.NotMember,
			};
		}

		// Handle direct messages (non-group conversations)
		if (!message.conversation.isGroup) {
			// Identify the recipient in the conversation (not the requester)
			receiverId = message.conversation.members.find((member) => member.userId !== userId)?.userId;

			// Ensure a recipient is found
			if (!receiverId) {
				return {
					message: null,
					receiverId: null,
					receiverIds: [],
					error: UserMessageError.NoRecipient,
				};
			}

			// Check if the requester and recipient are friends
			const isFriend = await areUsersFriends({ senderId: userId, receiverId });
			if (!isFriend) {
				return {
					message: null,
					receiverId: null,
					receiverIds: [],
					error: UserMessageError.NotAllowed,
				};
			}
		} else {
			// Handle group conversations by collecting all other member IDs
			receiverIds = message.conversation.members
				.filter((m) => m.userId !== userId)
				.map((m) => m.userId);
		}

		return { message, receiverId, receiverIds, error: null };
	} catch (error) {
		return {
			message: null,
			receiverId: null,
			receiverIds: [],
			error: UserMessageError.UnknownError,
		};
	}
};

export { getMessagesFromDB, getMessages, getUserMessage };
