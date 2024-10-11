"use client";

import type { MessageReaction } from "@prisma/client";
import type { ReactionClickData } from "@/app/messenger/(routes)/chats/_components/chat-message/reaction-trigger";

import ChatMessageContainer from "@/app/messenger/(routes)/chats/_components/chat-message/container";
import useMessengerDialogStore from "@/store/use-messenger-dialog-store";
import { cn } from "@/utils/general/cn";

interface ChatMessageTextProps {
	id: string;
	conversationId: string;
	content: string;
	reactions: MessageReaction[];
	timestamp: string;
	isSender: boolean;
	isRead?: boolean;
	isEdited?: boolean;
	isStarred?: boolean;
	onReaction: (emoji: ReactionClickData) => void;
	onToggleStar: () => void;
}

const ChatMessageText = ({
	id,
	conversationId,
	content,
	reactions,
	timestamp,
	isSender,
	isRead = false,
	isEdited = false,
	isStarred = false,
	onReaction,
	onToggleStar,
}: ChatMessageTextProps) => {
	const openEditMessageDialog = useMessengerDialogStore().onOpen;

	const handleEdit = () => {
		openEditMessageDialog("EDIT_MESSAGE", {
			messageToEdit: { messageid: id, conversationId, content, timestamp },
		});
	};

	return (
		<ChatMessageContainer
			timestamp={timestamp}
			reactions={reactions}
			isSender={isSender}
			isRead={isRead}
			isEdited={isEdited}
			isStarred={isStarred}
			onEdit={handleEdit}
			onReaction={onReaction}
			onToggleStar={onToggleStar}
		>
			<div
				className={cn(
					"max-w-56 rounded-xl px-4 py-3 text-sm leading-6 shadow-md sm:max-w-xs lg:max-w-md xl:max-w-xl 3xl:max-w-3xl",
					isSender
						? "rounded-tr-none bg-primary-400 text-neutral-50"
						: "rounded-tl-none bg-surface-light-100 dark:bg-surface-dark-400"
				)}
			>
				<div className={cn("flex items-center")}>
					<div className="flex-1">{content}</div>
				</div>
			</div>
		</ChatMessageContainer>
	);
};

export default ChatMessageText;
