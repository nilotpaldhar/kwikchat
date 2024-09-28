import type { CompleteMessage } from "@/types";

import { toast } from "sonner";

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import usePusher from "@/hooks/use-pusher";
import useCurrentUser from "@/hooks/tanstack-query/use-current-user";

import { messageKeys } from "@/constants/tanstack-query";
import { conversationEvents } from "@/constants/pusher-events";

import { fetchPrivateMessages, sendPrivateMessage } from "@/services/message";

import {
	optimisticSendPrivateMessage,
	optimisticSendPrivateMessageError,
	refetchOptimisticPrivateMessages,
} from "@/utils/optimistic-updates/message";
import { prependConversationMessage } from "@/utils/tanstack-query-cache/message";

import { generatePrivateChatChannelName } from "@/utils/pusher/generate-chat-channel-name";

/**
 * Custom hook for fetching private messages in a conversation using infinite scrolling.
 */
const usePrivateMessagesQuery = ({ conversationId }: { conversationId: string }) => {
	const queryClient = useQueryClient();
	const { data } = useCurrentUser();

	const query = useInfiniteQuery({
		queryKey: messageKeys.all(conversationId),
		queryFn: ({ pageParam }) => fetchPrivateMessages({ conversationId, page: pageParam }),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => lastPage.data?.pagination.nextPage,
	});

	const conversationChannel = data?.data?.id
		? generatePrivateChatChannelName({ conversationId, receiverId: data.data.id })
		: undefined;

	// Subscribe to Pusher events
	usePusher<CompleteMessage>(
		conversationChannel,
		conversationEvents.newMessage,
		(completeMessage) => {
			prependConversationMessage({ conversationId, message: completeMessage, queryClient });
		}
	);

	return query;
};

/**
 * Custom hook for sending private messages with optimistic updates.
 *
 * This hook manages sending private messages using mutations, including optimistic updates,
 * handling errors, and refetching data after the mutation settles.
 */
const useSendPrivateMessage = () => {
	const queryClient = useQueryClient();

	return useMutation({
		// Function that performs the actual message sending
		mutationFn: sendPrivateMessage,

		// Optimistically updates the message list before the mutation occurs.
		onMutate: ({ conversationId, senderId, message }) =>
			optimisticSendPrivateMessage({ conversationId, senderId, message, queryClient }),

		//  Handles any error that occurs during the message sending mutation.
		onError: (error, { conversationId }, context) => {
			optimisticSendPrivateMessageError({ conversationId, context, queryClient });
			toast.error(error.message);
		},

		// Called once the mutation is either successful or fails.
		onSettled: (data) => {
			refetchOptimisticPrivateMessages({
				conversationId: data?.data?.conversationId!,
				queryClient,
			});
		},
	});
};

export { usePrivateMessagesQuery, useSendPrivateMessage };
