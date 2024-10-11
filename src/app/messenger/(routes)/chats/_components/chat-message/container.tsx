"use client";

import type { MessageReaction } from "@prisma/client";
import type { ReactionClickData } from "@/app/messenger/(routes)/chats/_components/chat-message/reaction-trigger";

import { useState } from "react";

import ChatMessageMeta from "@/app/messenger/(routes)/chats/_components/chat-message/meta";
import ChatMessageActions from "@/app/messenger/(routes)/chats/_components/chat-message/actions";
import ChatMessageReactions from "@/app/messenger/(routes)/chats/_components/chat-message/reactions";

import { cn } from "@/utils/general/cn";

interface ChatMessageContainerProps {
	timestamp: string;
	reactions: MessageReaction[];
	isSender: boolean;
	isRead?: boolean;
	isEdited?: boolean;
	isStarred?: boolean;
	onEdit?: () => void;
	onReaction?: (emoji: ReactionClickData) => void;
	onToggleStar?: () => void;
	children: React.ReactNode;
}

const ChatMessageContainer = ({
	timestamp,
	reactions,
	isSender,
	isRead = false,
	isEdited = false,
	isStarred = false,
	onEdit = () => {},
	onReaction = () => {},
	onToggleStar = () => {},
	children,
}: ChatMessageContainerProps) => {
	const [isActionsOpen, setIsActionsOpen] = useState(false);

	return (
		<div
			tabIndex={0}
			role="button"
			aria-label="Chat message with actions"
			className={cn(
				"flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 dark:focus-visible:ring-neutral-600",
				isSender ? "justify-end" : "justify-start"
			)}
			onMouseEnter={() => setIsActionsOpen(true)}
			onMouseLeave={() => setIsActionsOpen(false)}
			onFocus={() => setIsActionsOpen(true)}
			onBlur={() => setIsActionsOpen(false)}
		>
			<div className={cn("relative flex flex-col space-y-2", isSender && "order-2")}>
				{children}
				<ChatMessageMeta
					timestamp={timestamp}
					isSender={isSender}
					isRead={isRead}
					isEdited={isEdited}
					isStarred={isStarred}
				/>
				<ChatMessageReactions reactions={reactions} />
			</div>
			<ChatMessageActions
				isOpen={isActionsOpen}
				isSender={isSender}
				onEdit={onEdit}
				onReaction={onReaction}
				isStarred={isStarred}
				onToggleStar={onToggleStar}
			/>
		</div>
	);
};

export default ChatMessageContainer;
