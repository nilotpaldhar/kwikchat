"use client";

import { Ban } from "lucide-react";
import { cn } from "@/utils/general/cn";

interface ChatMessageDeletedProps {
	isSender: boolean;
	className?: string;
}

const ChatMessageDeleted = ({ isSender, className }: ChatMessageDeletedProps) => (
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
					"flex flex-1 items-center space-x-1.5 font-semibold italic",
					isSender ? "text-neutral-300" : "text-neutral-400"
				)}
			>
				<Ban size={20} />
				<span className="block">This message was deleted</span>
			</div>
		</div>
	</div>
);

export default ChatMessageDeleted;
