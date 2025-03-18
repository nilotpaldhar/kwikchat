"use client";

import type { MessageReaction } from "@prisma/client";
import type { ReactionClickData } from "@/app/messenger/(chat-features)/_components/chat-message/chat-message-reaction-button";

import { useState } from "react";

import ChatMessageText from "@/app/messenger/(chat-features)/_components/chat-message/chat-message-text";
import ChatMessageImage from "@/app/messenger/(chat-features)/_components/chat-message/chat-message-image";
import ChatMessageDocument from "@/app/messenger/(chat-features)/_components/chat-message/chat-message-document";
import ChatMessageSystem from "@/app/messenger/(chat-features)/_components/chat-message/chat-message-system";
import ChatMessageDeleted from "@/app/messenger/(chat-features)/_components/chat-message/chat-message-deleted";

import ChatMessageMeta from "@/app/messenger/(chat-features)/_components/chat-message/chat-message-meta";
import ChatMessageReactions from "@/app/messenger/(chat-features)/_components/chat-message/chat-message-reactions";
import ChatMessageInteractionBar from "@/app/messenger/(chat-features)/_components/chat-message/chat-message-interaction-bar";

import { cn } from "@/utils/general/cn";

interface ChatMessageProps extends React.HTMLAttributes<HTMLDivElement> {
	timestamp: string;
	reactions: MessageReaction[];
	isSender: boolean;
	isRead?: boolean;
	isEdited?: boolean;
	isStarred?: boolean;
	isDeleted?: boolean;
	hideInteractionBar?: boolean;
	onEdit?: () => void;
	onReaction?: (emoji: ReactionClickData) => void;
	onToggleStar?: () => void;
	onDelete?: () => void;
}

const ChatMessage = ({
	timestamp,
	reactions,
	isSender,
	isRead = false,
	isEdited = false,
	isStarred = false,
	isDeleted = false,
	hideInteractionBar = false,
	onEdit = () => {},
	onReaction = () => {},
	onToggleStar = () => {},
	onDelete = () => {},
	children,
	className,
	...props
}: ChatMessageProps) => {
	const [isActionsOpen, setIsActionsOpen] = useState(false);

	return (
		<div
			tabIndex={0}
			role="button"
			aria-label="Chat message with actions"
			className={cn(
				"flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 dark:focus-visible:ring-neutral-600",
				isSender ? "justify-end" : "justify-start",
				className
			)}
			onMouseEnter={() => setIsActionsOpen(true)}
			onMouseLeave={() => setIsActionsOpen(false)}
			onFocus={() => setIsActionsOpen(true)}
			onBlur={() => setIsActionsOpen(false)}
			{...props}
		>
			<div className={cn("relative flex flex-col space-y-2", isSender && "order-2")}>
				{children}
				<ChatMessageMeta
					timestamp={timestamp}
					isSender={isSender}
					isRead={isRead}
					isEdited={isEdited}
					isStarred={isStarred}
					isDeleted={isDeleted}
				/>
				{!isDeleted && <ChatMessageReactions reactions={reactions} />}
			</div>
			{!hideInteractionBar && (
				<ChatMessageInteractionBar
					isOpen={isActionsOpen}
					isSender={isSender}
					isDeleted={isDeleted}
					onEdit={onEdit}
					onReaction={onReaction}
					isStarred={isStarred}
					onToggleStar={onToggleStar}
					onDelete={onDelete}
				/>
			)}
		</div>
	);
};

export {
	ChatMessage,
	ChatMessageText,
	ChatMessageImage,
	ChatMessageDocument,
	ChatMessageSystem,
	ChatMessageDeleted,
};
