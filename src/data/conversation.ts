import "server-only";

import type { ConversationWithMetadata, PaginatedResponse } from "@/types";

import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";
import { RECENT_MESSAGE_INCLUDE } from "@/data/message";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constants/pagination";
import { calculatePagination } from "@/utils/general/calculate-pagination";

interface GetUserConversationsWithMetadataParams {
	userId: string;
	page?: number;
	pageSize?: number;
	groupOnly?: boolean;
	includeUnreadOnly?: boolean;
}

// Include configuration for fetching conversation metadata
const CONVERSATION_WITH_METADATA_INCLUDE = {
	groupDetails: { include: { icon: true } },
	members: { select: { user: { omit: { password: true } } } },
	messages: {
		take: 1,
		orderBy: { createdAt: "desc" },
		include: RECENT_MESSAGE_INCLUDE,
	},
} satisfies Prisma.ConversationInclude;

/**
 * Fetch a single conversation with metadata for a specific user.
 */
const getUserConversationWithMetadata = async ({
	conversationId,
	userId,
}: {
	conversationId: string;
	userId: string;
}): Promise<ConversationWithMetadata | null> => {
	try {
		const conversation = await prisma.conversation.findFirst({
			where: {
				id: conversationId,
				members: { some: { userId } },
			},
			include: {
				...CONVERSATION_WITH_METADATA_INCLUDE,
				_count: {
					select: {
						messages: {
							where: {
								senderId: { not: userId },
								seenByMembers: { none: { member: { userId } } },
							},
						},
					},
				},
			},
		});

		if (!conversation) return null;

		const { messages, members, _count: count, ...rest } = conversation;

		const participant =
			members.filter((member) => member.user.id !== userId).map((member) => member.user)[0] ?? null;

		return {
			...rest,
			unreadMessages: count.messages,
			recentMessage: messages[0] ?? null,
			participant: !conversation.isGroup ? participant : null,
		};
	} catch (error) {
		return null;
	}
};

/**
 * Fetch user conversations with metadata from the database.
 */
const getUserConversationsWithMetadataFromDB = async ({
	userId,
	page = DEFAULT_PAGE,
	pageSize = DEFAULT_PAGE_SIZE,
	groupOnly = false,
	includeUnreadOnly = false,
}: GetUserConversationsWithMetadataParams) => {
	// Calculate the offset for pagination
	const skip = (page - 1) * pageSize;
	const take = pageSize;

	const baseWhereClauseForConversations: Prisma.ConversationWhereInput = {
		members: { some: { userId } },
		isGroup: groupOnly || undefined,
	};

	const baseWhereClauseForMessages: Prisma.MessageWhereInput = {
		senderId: { not: userId },
		seenByMembers: { none: { member: { userId } } },
	};

	if (includeUnreadOnly) {
		baseWhereClauseForConversations.messages = {
			some: { ...baseWhereClauseForMessages },
		};
	}

	try {
		const [conversations, totalItems] = await Promise.all([
			prisma.conversation.findMany({
				where: baseWhereClauseForConversations,
				include: {
					...CONVERSATION_WITH_METADATA_INCLUDE,
					_count: {
						select: {
							messages: {
								where: baseWhereClauseForMessages,
							},
						},
					},
				},
				skip,
				take,
				orderBy: { updatedAt: "desc" },
			}),

			prisma.conversation.count({
				where: baseWhereClauseForConversations,
			}),
		]);

		const conversationList: ConversationWithMetadata[] = conversations.map((conversation) => {
			const { messages, members, _count: count, ...rest } = conversation;

			const participant =
				members.filter((member) => member.user.id !== userId).map((member) => member.user)[0] ??
				null;

			return {
				...rest,
				unreadMessages: count.messages,
				recentMessage: messages[0] ?? null,
				participant: !conversation.isGroup ? participant : null,
			};
		});

		return { conversationList, totalItems };
	} catch (error) {
		return { conversationList: [], totalItems: 0 };
	}
};

/**
 * Fetch user conversations with metadata.
 */
const getUserConversationsWithMetadata = async ({
	userId,
	page = DEFAULT_PAGE,
	pageSize = DEFAULT_PAGE_SIZE,
	groupOnly = false,
	includeUnreadOnly = false,
}: GetUserConversationsWithMetadataParams): Promise<
	PaginatedResponse<ConversationWithMetadata>
> => {
	const { conversationList, totalItems } = await getUserConversationsWithMetadataFromDB({
		userId,
		page,
		pageSize,
		groupOnly,
		includeUnreadOnly,
	});

	const paginationMetadata = calculatePagination({ page, pageSize, totalItems });

	return { pagination: paginationMetadata, items: conversationList };
};

/**
 * Retrieves an existing one-on-one conversation between two users.
 */
const getConversationBetweenUsers = async ({
	userId1,
	userId2,
}: {
	userId1: string;
	userId2: string;
}) => {
	try {
		const conversation = await prisma.conversation.findFirst({
			where: {
				isGroup: false,
				members: { every: { OR: [{ userId: userId1 }, { userId: userId2 }] } },
			},
		});

		return conversation;
	} catch (error) {
		return null;
	}
};

/**
 * Retrieves a conversation by its unique ID.
 */
const getConversationById = async (id: string) => {
	try {
		const conversation = await prisma.conversation.findUnique({
			where: { id },
		});

		return conversation;
	} catch (error) {
		return null;
	}
};

/**
 * Retrieves a conversation by its ID and user ID.
 */
const getConversationByIdAndUserId = async ({ id, userId }: { id: string; userId: string }) => {
	try {
		const conversation = await prisma.conversation.findFirst({
			where: { id, members: { some: { userId } } },
		});

		return conversation;
	} catch (error) {
		return null;
	}
};

/**
 * Retrieves the first conversation for a given conversation ID
 * and checks if the current user is a member of that conversation.
 */
const getUserConversation = async ({
	conversationId,
	userId,
}: {
	conversationId: string;
	userId: string;
}) => {
	try {
		const conversation = await prisma.conversation.findFirst({
			where: {
				id: conversationId,
				members: { some: { userId } },
			},
		});

		return conversation;
	} catch (error) {
		return null;
	}
};

/**
 * Retrieves a list of conversations for a specified user.
 * This function queries the database for conversations in which the user is a member
 * and returns all matching conversations.
 */
const getUserConversationList = async ({ userId }: { userId: string }) => {
	try {
		const conversations = await prisma.conversation.findMany({
			where: {
				members: { some: { userId } },
			},
		});

		return conversations;
	} catch (error) {
		return [];
	}
};

export {
	getUserConversationWithMetadata,
	getUserConversationsWithMetadata,
	getConversationBetweenUsers,
	getConversationById,
	getConversationByIdAndUserId,
	getUserConversation,
	getUserConversationList,
};
