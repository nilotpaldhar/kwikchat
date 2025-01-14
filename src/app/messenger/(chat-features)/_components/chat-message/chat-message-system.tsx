"use client";

import { cn } from "@/utils/general/cn";

interface ChatMessageSystemProps {
	isSender: boolean;
	content: string;
	className?: string;
}

const ChatMessageSystem = ({ isSender, content, className }: ChatMessageSystemProps) => (
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
			<div
				className={cn(
					"flex flex-1 items-center font-semibold italic",
					isSender ? "text-neutral-300" : "text-neutral-400"
				)}
			>
				<span className="block">{content}</span>
			</div>
		</div>
	</div>
);

export default ChatMessageSystem;
