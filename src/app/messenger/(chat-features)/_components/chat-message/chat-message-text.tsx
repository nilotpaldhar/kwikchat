"use client";

import { cn } from "@/utils/general/cn";

interface ChatMessageTextProps {
	isSender: boolean;
	messageContent: string;
	className?: string;
}

const ChatMessageText = ({ isSender, messageContent, className }: ChatMessageTextProps) => (
	<div
		className={cn(
			"message-pill",
			isSender
				? "!rounded-tr-none bg-primary-400 text-neutral-50"
				: "!rounded-tl-none bg-surface-light-100 dark:bg-surface-dark-400",
			className
		)}
	>
		<div className={cn("flex items-center")}>
			<div className="flex-1 whitespace-pre-line">{messageContent}</div>
		</div>
	</div>
);

export default ChatMessageText;
