"use client";

import type { MessageReaction } from "@prisma/client";
import type { ReactionClickData } from "@/app/messenger/(routes)/chats/_components/chat-message/reaction-trigger";

import { Image } from "lucide-react";
import ChatMessageContainer from "@/app/messenger/(routes)/chats/_components/chat-message/container";

import { cn } from "@/utils/general/cn";

interface ChatMessageImageProps {
	timestamp: string;
	reactions: MessageReaction[];
	isSender: boolean;
	isRead?: boolean;
	isEdited?: boolean;
	isStarred?: boolean;
	onReaction: (emoji: ReactionClickData) => void;
	onToggleStar: () => void;
}

const ChatMessageImage = ({
	timestamp,
	reactions,
	isSender,
	isRead = false,
	isEdited = false,
	isStarred = false,
	onReaction,
	onToggleStar,
}: ChatMessageImageProps) => (
	<ChatMessageContainer
		timestamp={timestamp}
		reactions={reactions}
		isSender={isSender}
		isRead={isRead}
		isEdited={isEdited}
		isStarred={isStarred}
		onReaction={onReaction}
		onToggleStar={onToggleStar}
	>
		<div
			className={cn(
				"h-56 w-56 rounded-2xl",
				isSender
					? "rounded-tr-none bg-primary-400 text-neutral-50"
					: "rounded-tl-none bg-surface-light-100 dark:bg-surface-dark-400"
			)}
		>
			<div className={cn("flex h-full items-center justify-center")}>
				<Image size={40} />
			</div>
		</div>
	</ChatMessageContainer>
);

export default ChatMessageImage;
