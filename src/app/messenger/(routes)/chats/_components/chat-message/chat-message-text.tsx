"use client";

import { cn } from "@/utils/general/cn";

interface ChatMessageTextProps {
	isSender: boolean;
	content: string;
	className?: string;
}

const ChatMessageText = ({ isSender, content, className }: ChatMessageTextProps) => (
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
			<div className="flex-1">{content}</div>
		</div>
	</div>
);

export default ChatMessageText;
