"use client";

import { MessageType } from "@prisma/client";
import type { CompleteMessage } from "@/types";
import type { ReactionClickData } from "@/app/messenger/(chat-features)/_components/chat-message/chat-message-reaction-button";

import { useMemo } from "react";
import { format } from "date-fns";
import { toast } from "sonner";

import {
	ChatMessage,
	ChatMessageText,
	ChatMessageImage,
	ChatMessageDocument,
	ChatMessageSystem,
	ChatMessageDeleted,
} from "@/app/messenger/(chat-features)/_components/chat-message";

import {
	useCreateMessageReaction,
	useUpdateMessageReaction,
	useDeleteMessageReaction,
	useToggleMessageStarStatus,
} from "@/hooks/tanstack-query/use-message";

import useMessengerDialogStore from "@/store/use-messenger-dialog-store";

import isMessageEdited from "@/utils/messenger/is-message-edited";

interface ChatMessageFactoryProps {
	message: CompleteMessage;
	currentUserId: string;
}

const ChatMessageFactory = ({ message, currentUserId }: ChatMessageFactoryProps) => {
	// Destructure message properties for readability
	const content = message.textMessage?.content ?? "";
	const reactions = message.reactions;
	const isSender = currentUserId === message.senderId;
	const isRead = message.seenByMembers.length > 0;
	const isEdited = isMessageEdited(message);
	const formattedTime = useMemo(() => format(message.createdAt, "hh:mm a"), [message.createdAt]);

	// Dialog store for opening popups like edit or delete message
	const openMessageDialog = useMessengerDialogStore().onOpen;

	// Message reaction mutations
	const { mutate: createMessageReactionMutation } = useCreateMessageReaction();
	const { mutate: updateMessageReactionMutation } = useUpdateMessageReaction();
	const { mutate: deleteMessageReactionMutation } = useDeleteMessageReaction();
	const { mutate: toggleMessageStarStatusMutation } = useToggleMessageStarStatus();

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

	/**
	 * Handles the toggle action for the star status of a message.
	 * Calls the mutation to toggle the star status of the specified message.
	 */
	const handleToggleStarStatus = () => {
		toggleMessageStarStatusMutation({ conversationId: message.conversationId, message });
	};

	/**
	 * Opens the edit message dialog with the current message data.
	 */
	const handleEdit = () => {
		if (message.type !== MessageType.text) {
			toast.error("Unable to Edit", {
				description: "You can only edit text messages. Other message types cannot be modified.",
			});
			return;
		}

		openMessageDialog("EDIT_MESSAGE", {
			messageToEdit: {
				messageId: message.id,
				conversationId: message.conversationId,
				content,
				timestamp: formattedTime,
			},
		});
	};

	/**
	 * Opens the delete message dialog with the current message data.
	 */
	const handleDelete = () => {
		openMessageDialog("DELETE_MESSAGE", {
			messageToDelete: {
				message,
				showDeleteForEveryone: isSender && !message.isDeleted,
			},
		});
	};

	return (
		<ChatMessage
			timestamp={formattedTime}
			reactions={reactions}
			isSender={isSender}
			isRead={isRead}
			isEdited={isEdited}
			isStarred={message.isStarred}
			isDeleted={message.isDeleted}
			hideInteractionBar={message.type === "system"}
			onReaction={handleReaction}
			onToggleStar={handleToggleStarStatus}
			onEdit={handleEdit}
			onDelete={handleDelete}
		>
			{message.type === MessageType.text ? (
				<ChatMessageText isSender={isSender} messageContent={content} />
			) : null}
			{message.type === MessageType.image ? (
				<ChatMessageImage
					conversationId={message.conversationId}
					messageId={message.id}
					isSender={isSender}
					attachments={message.imageMessage}
				/>
			) : null}
			{message.type === MessageType.document ? (
				<ChatMessageDocument
					conversationId={message.conversationId}
					messageId={message.id}
					isSender={isSender}
					attachment={message.documentMessage}
				/>
			) : null}
			{message.type === MessageType.system ? (
				<ChatMessageSystem isSender={isSender} content={message.systemMessage?.content ?? ""} />
			) : null}
			{message.type === MessageType.deleted ? <ChatMessageDeleted isSender={isSender} /> : null}
		</ChatMessage>
	);
};

export default ChatMessageFactory;
