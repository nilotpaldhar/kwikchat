"use client";

import type { CompleteMessage } from "@/types";
import type { ReactionClickData } from "@/app/messenger/(routes)/chats/_components/chat-message/reaction-trigger";

import { useMemo } from "react";
import { format } from "date-fns";

import ChatMessageText from "@/app/messenger/(routes)/chats/_components/chat-message/text";
import ChatMessageImage from "@/app/messenger/(routes)/chats/_components/chat-message/image";

import {
	useCreateMessageReaction,
	useUpdateMessageReaction,
	useDeleteMessageReaction,
} from "@/hooks/tanstack-query/use-message";

import isMessageEdited from "@/utils/messenger/is-message-edited";

interface ChatMessageFactoryProps {
	message: CompleteMessage;
	currentUserId: string;
}

const ChatMessageFactory = ({ message, currentUserId }: ChatMessageFactoryProps) => {
	const content = message.textMessage?.content ?? "";
	const reactions = message.reactions;
	const isSender = currentUserId === message.senderId;
	const isRead = message.seenByMembers.length > 0;
	const isEdited = isMessageEdited(message);
	const formattedTime = useMemo(() => format(message.createdAt, "hh:mm a"), [message.createdAt]);

	const { mutate: createMessageReactionMutation } = useCreateMessageReaction();
	const { mutate: updateMessageReactionMutation } = useUpdateMessageReaction();
	const { mutate: deleteMessageReactionMutation } = useDeleteMessageReaction();

	/**
	 * Handles the user's reaction to a message by creating, updating, or deleting the reaction
	 * based on the user's current reaction state.
	 */
	const handleReaction = ({ reactionType, emoji, emojiImageUrl }: ReactionClickData) => {
		const { conversationId, id: messageId } = message;

		// Find the user's existing reaction (if any)
		const existingReaction = reactions.find((reaction) => reaction.userId === currentUserId);

		// If the user has not reacted, create a new reaction
		if (!existingReaction) {
			return createMessageReactionMutation({
				conversationId,
				messageId,
				userId: currentUserId,
				reactionType,
				emoji,
				emojiImageUrl,
			});
		}

		// If the user has reacted but selects a different emoji, update the reaction
		if (existingReaction.type !== reactionType) {
			return updateMessageReactionMutation({
				conversationId,
				messageId,
				messageReaction: { ...existingReaction, type: reactionType, emoji, emojiImageUrl },
				data: { reactionType, emoji, emojiImageUrl },
			});
		}

		// If the user has reacted and selects the same emoji, delete the reaction
		return deleteMessageReactionMutation({
			conversationId,
			messageId,
			messageReaction: existingReaction,
		});
	};

	if (message.type === "image") {
		return (
			<ChatMessageImage
				timestamp={formattedTime}
				reactions={message.reactions}
				isSender={isSender}
				isRead={isRead}
				isEdited={isEdited}
				onReaction={handleReaction}
			/>
		);
	}

	if (message.type === "text") {
		return (
			<ChatMessageText
				id={message.id}
				conversationId={message.conversationId}
				content={content}
				reactions={message.reactions}
				timestamp={formattedTime}
				isSender={isSender}
				isRead={isRead}
				isEdited={isEdited}
				onReaction={handleReaction}
			/>
		);
	}

	return null;
};

export default ChatMessageFactory;
