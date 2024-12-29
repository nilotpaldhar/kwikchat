import type { MessageReaction } from "@prisma/client";
import type { CompleteMessage, MessageSeenMembers } from "@/types";

import { toast } from "sonner";

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import usePusher from "@/hooks/use-pusher";
import useCurrentUser from "@/hooks/tanstack-query/use-current-user";

import { messageKeys } from "@/constants/tanstack-query";
import { conversationEvents } from "@/constants/pusher-events";

import {
	fetchMessages,
	fetchStarredMessages,
	sendMessage,
	updateMessage,
	updateMessageSeenStatus,
	createMessageReaction,
	updateMessageReaction,
	deleteMessageReaction,
	toggleMessageStarStatus,
	deleteMessage,
} from "@/services/message";

import {
	optimisticSendPrivateMessage,
	optimisticUpdatePrivateTextMessage,
	optimisticCreateMessageReaction,
	optimisticUpdateMessageReaction,
	optimisticDeleteMessageReaction,
	optimisticToggleMessageStarStatus,
	optimisticPrivateMessageError,
	optimisticDeleteMessage,
	refetchOptimisticPrivateMessages,
	optimisticStarredMessageError,
} from "@/utils/optimistic-updates/message";
import {
	optimisticUpdateConversationRecentMsg,
	optimisticUpdateConversationRecentMsgError,
	refetchOptimisticConversation,
} from "@/utils/optimistic-updates/conversation";
import {
	prependConversationMessage,
	updateMessagesSeenMembers,
	updateTextMessageContent,
	appendMessageReaction,
	updateMessageReaction as updateMessageReactionCache,
	removeMessageReaction as removeMessageReactionCache,
} from "@/utils/tanstack-query-cache/message";

import generateChatMessagingChannel from "@/utils/pusher/generate-chat-messaging-channel";

/**
 * Custom hook for fetching private messages in a conversation using infinite scrolling.
 */
const useMessagesQuery = ({
	conversationId,
	isGroup = false,
}: {
	conversationId: string;
	isGroup?: boolean;
}) => {
	const queryClient = useQueryClient();
	const { data } = useCurrentUser();

	const query = useInfiniteQuery({
		queryKey: messageKeys.all(conversationId),
		queryFn: ({ pageParam }) => fetchMessages({ conversationId, page: pageParam }),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => lastPage.data?.pagination.nextPage,
	});

	const chatMessagingChannel = data?.data?.id
		? generateChatMessagingChannel({
				conversationId,
				conversationType: isGroup ? "group" : "private",
				receiverId: data.data.id,
			})
		: undefined;

	// Subscribe to Pusher events
	usePusher<CompleteMessage>(
		chatMessagingChannel,
		conversationEvents.newMessage,
		(completeMessage) => {
			prependConversationMessage({ conversationId, message: completeMessage, queryClient });
		}
	);
	usePusher<CompleteMessage>(
		chatMessagingChannel,
		conversationEvents.updateMessage,
		(completeMessage) => {
			updateTextMessageContent({
				conversationId,
				messageId: completeMessage?.id!,
				messageContent: completeMessage?.textMessage?.content!,
				queryClient,
			});
		}
	);
	usePusher<MessageSeenMembers[]>(
		chatMessagingChannel,
		conversationEvents.seenMessage,
		(messageSeenMembers) => {
			updateMessagesSeenMembers({ conversationId, messageSeenMembers, queryClient });
		}
	);
	usePusher<MessageReaction>(
		chatMessagingChannel,
		conversationEvents.createReaction,
		(messageReaction) => {
			appendMessageReaction({ conversationId, messageReaction, queryClient });
		}
	);
	usePusher<MessageReaction>(
		chatMessagingChannel,
		conversationEvents.updateReaction,
		(messageReaction) => {
			updateMessageReactionCache({ conversationId, messageReaction, queryClient });
		}
	);
	usePusher<MessageReaction>(
		chatMessagingChannel,
		conversationEvents.removeReaction,
		(messageReaction) => {
			removeMessageReactionCache({ conversationId, messageReaction, queryClient });
		}
	);

	return query;
};

/**
 * Custom hook for fetching starred messages in a conversation using infinite scrolling.
 */
const useStarredMessagesQuery = ({ conversationId }: { conversationId: string }) => {
	const query = useInfiniteQuery({
		queryKey: messageKeys.starred(conversationId),
		queryFn: ({ pageParam }) => fetchStarredMessages({ conversationId, page: pageParam }),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => lastPage.data?.pagination.nextPage,
	});

	return query;
};

/**
 * Custom hook for sending messages with optimistic updates.
 *
 * This hook manages sending messages using mutations, including optimistic updates,
 * handling errors, and refetching data after the mutation settles.
 */
const useSendMessage = () => {
	const queryClient = useQueryClient();

	return useMutation({
		// Function that performs the actual message sending
		mutationFn: sendMessage,

		// Optimistically updates the message list before the mutation occurs.
		onMutate: async ({ conversationId, sender, message }) => {
			const [messageData, conversationData] = await Promise.all([
				optimisticSendPrivateMessage({ conversationId, sender, message, queryClient }),
				optimisticUpdateConversationRecentMsg({
					conversationId,
					senderId: sender.id,
					message,
					queryClient,
				}),
			]);

			return { ...messageData, ...conversationData };
		},

		//  Handles any error that occurs during the message sending mutation.
		onError: (error, { conversationId }, context) => {
			optimisticPrivateMessageError({ conversationId, context, queryClient });
			optimisticUpdateConversationRecentMsgError({ context, queryClient });
			toast.error(error.message);
		},

		// Called once the mutation is either successful or fails.
		onSettled: (_data, _error, { conversationId }) => {
			refetchOptimisticPrivateMessages({
				conversationId,
				queryClient,
			});
			refetchOptimisticConversation({
				conversationId,
				opsType: "send_message",
				queryClient,
			});
		},
	});
};

/**
 * Custom hook for updating a message in a conversation.
 *
 * It uses React Query's `useMutation` to handle the mutation process
 * and provides optimistic updates for a better user experience.
 */
const useUpdateMessage = () => {
	const queryClient = useQueryClient();

	return useMutation({
		// Function that performs the actual message update
		mutationFn: updateMessage,

		// Optimistically updates the message in the cache before the mutation occurs on the server
		// This ensures the UI is updated immediately, providing a faster response for the user
		onMutate: ({ conversationId, messageId, message }) =>
			optimisticUpdatePrivateTextMessage({ conversationId, messageId, message, queryClient }),

		// Handles any errors that occur during the mutation
		// Rolls back the optimistic update if the mutation fails
		onError: (error, { conversationId }, context) => {
			optimisticPrivateMessageError({ conversationId, context, queryClient });
			toast.error(error.message);
		},

		// Called once the mutation is either successful or fails
		// Ensures the cache is refetched and up to date after the mutation settles
		onSettled: (_data, _error, { conversationId }) => {
			refetchOptimisticPrivateMessages({
				conversationId,
				queryClient,
			});
		},
	});
};

/**
 * Custom hook for managing the seen status of messages.
 *
 * This hook utilizes a mutation to update the seen status and
 * handles updating the local state in the query client upon success.
 */
const useMessagesSeenStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		// The function that performs the mutation (updating seen status)
		mutationFn: updateMessageSeenStatus,

		// Function to run upon a successful mutation
		onSuccess: (data, { conversationId }) => {
			// Extract the updated message seen members from the response
			const messageSeenMembers = data.data;

			// Update the local state cache with the new seen members for the specified conversation
			updateMessagesSeenMembers({ conversationId, messageSeenMembers, queryClient });
		},
	});
};

/**
 * Custom hook for creating a message reaction.
 *
 * Uses an optimistic update approach to instantly reflect the reaction on the UI.
 * Handles potential errors and ensures data consistency by refetching the conversation.
 */
const useCreateMessageReaction = () => {
	const queryClient = useQueryClient();

	return useMutation({
		// The mutation function responsible for creating a message reaction
		mutationFn: createMessageReaction,

		// Called before the mutation function is fired to perform an optimistic update
		onMutate: ({ conversationId, messageId, userId, reactionType, emoji, emojiImageUrl }) =>
			optimisticCreateMessageReaction({
				conversationId,
				messageId,
				userId,
				reactionType,
				emoji,
				emojiImageUrl,
				queryClient,
			}),

		// Handles any errors that occur during the mutation
		// Rolls back the optimistic update if the mutation fails
		onError: (error, { conversationId }, context) => {
			optimisticPrivateMessageError({ conversationId, context, queryClient });
			toast.error(error.message);
		},

		// Called once the mutation is either successful or fails
		// Ensures the cache is refetched and up to date after the mutation settles
		onSettled: (_data, _error, { conversationId }) => {
			refetchOptimisticPrivateMessages({
				conversationId,
				queryClient,
			});
		},
	});
};

/**
 * Custom hook for updating a message reaction.
 *
 * Uses an optimistic update approach to instantly reflect the changes on the UI.
 * Handles errors and ensures data consistency by refetching the conversation.
 */
const useUpdateMessageReaction = () => {
	const queryClient = useQueryClient();

	return useMutation({
		// The mutation function responsible for updating a message reaction
		mutationFn: updateMessageReaction,

		// Called before the mutation function is fired to perform an optimistic update
		onMutate: ({ conversationId, messageReaction }) =>
			optimisticUpdateMessageReaction({ conversationId, messageReaction, queryClient }),

		// Handles any errors that occur during the mutation
		// Rolls back the optimistic update if the mutation fails
		onError: (error, { conversationId }, context) => {
			optimisticPrivateMessageError({ conversationId, context, queryClient });
			toast.error(error.message);
		},

		// Called once the mutation is either successful or fails
		// Ensures the cache is refetched and up to date after the mutation settles
		onSettled: (_data, _error, { conversationId }) => {
			refetchOptimisticPrivateMessages({
				conversationId,
				queryClient,
			});
		},
	});
};

/**
 * Custom hook for deleting a message reaction.
 *
 * Uses an optimistic update approach to instantly remove the reaction from the UI.
 * Handles errors and ensures data consistency by refetching the conversation.
 */
const useDeleteMessageReaction = () => {
	const queryClient = useQueryClient();

	return useMutation({
		// The mutation function responsible for deleting a message reaction
		mutationFn: deleteMessageReaction,

		// Called before the mutation function is fired to perform an optimistic update
		onMutate: ({ conversationId, messageReaction }) =>
			optimisticDeleteMessageReaction({ conversationId, messageReaction, queryClient }),

		// Handles any errors that occur during the mutation
		// Rolls back the optimistic update if the mutation fails
		onError: (error, { conversationId }, context) => {
			optimisticPrivateMessageError({ conversationId, context, queryClient });
			toast.error(error.message);
		},

		// Called once the mutation is either successful or fails
		// Ensures the cache is refetched and up to date after the mutation settles
		onSettled: (_data, _error, { conversationId }) => {
			refetchOptimisticPrivateMessages({
				conversationId,
				queryClient,
			});
		},
	});
};

/**
 * Custom hook that provides functionality to toggle the star status of a message.
 *
 * It handles the mutation logic, optimistic updates, error handling, and cache refetching.
 */
const useToggleMessageStarStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		// Function to be called when the mutation is triggered
		mutationFn: toggleMessageStarStatus,

		// Optimistically updates the cache with the new star status before the mutation is completed
		onMutate: ({ conversationId, message }) =>
			optimisticToggleMessageStarStatus({ conversationId, message, queryClient }),

		// Handles any errors that occur during the mutation
		// Rolls back the optimistic update if the mutation fails
		onError: (error, { conversationId }, context) => {
			optimisticPrivateMessageError({ conversationId, context, queryClient });
			optimisticStarredMessageError({ conversationId, context, queryClient });
			toast.error(error.message);
		},

		// Called once the mutation is either successful or fails
		// Ensures the cache is refetched and up to date after the mutation settles
		onSettled: (_data, _error, { conversationId }) => {
			refetchOptimisticPrivateMessages({
				conversationId,
				queryClient,
			});
		},
	});
};

/**
 * Custom hook to handle the deletion of a message using optimistic updates.
 * It provides mutation functionality to delete a message and manages the state
 * of the conversation and starred messages with React Query's query client.
 */
const useDeleteMessage = () => {
	const queryClient = useQueryClient();

	return useMutation({
		// Function that performs the mutation to delete a message
		mutationFn: deleteMessage,

		// Called before the mutation function is triggered to handle optimistic updates
		onMutate: ({ conversationId, message, deleteForEveryone }) =>
			optimisticDeleteMessage({ conversationId, message, deleteForEveryone, queryClient }),

		// Called if the mutation fails, rolling back optimistic updates and showing an error message
		onError: (error, { conversationId }, context) => {
			optimisticPrivateMessageError({ conversationId, context, queryClient });
			optimisticStarredMessageError({ conversationId, context, queryClient });
			toast.error(error.message);
		},

		// Called when the mutation either succeeds or fails, to refetch the conversation messages
		onSettled: (_data, _error, { conversationId }) => {
			refetchOptimisticPrivateMessages({
				conversationId,
				queryClient,
			});
		},
	});
};

export {
	useMessagesQuery,
	useStarredMessagesQuery,
	useSendMessage,
	useUpdateMessage,
	useMessagesSeenStatus,
	useCreateMessageReaction,
	useUpdateMessageReaction,
	useDeleteMessageReaction,
	useToggleMessageStarStatus,
	useDeleteMessage,
};
