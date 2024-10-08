"use client";

import { cn } from "@/utils/general/cn";
import { CheckCheck, Star } from "lucide-react";

interface ChatMessageMetaProps {
	timestamp: string;
	isSender: boolean;
	isRead: boolean;
	isEdited: boolean;
	isStarred: boolean;
}

const ChatMessageMeta = ({
	timestamp,
	isSender,
	isRead,
	isEdited,
	isStarred,
}: ChatMessageMetaProps) => (
	<div
		className={cn(
			"flex items-center gap-x-2 px-1 text-xs font-semibold leading-none text-neutral-500 dark:text-neutral-400",
			isSender ? "justify-end" : "justify-start"
		)}
	>
		{isSender && (
			<div
				className={cn(
					"order-4",
					isRead ? "text-blue-600" : "text-neutral-500 dark:text-neutral-400"
				)}
			>
				<CheckCheck size={12} />
			</div>
		)}
		<div className={cn("lowercase", isSender && "order-3")}>{timestamp}</div>
		{isEdited && <div className={cn("capitalize", isSender && "order-2")}>Edited</div>}
		{isStarred && (
			<div className={cn(isSender && "order-1")}>
				<Star size={12} />
				<span className="sr-only">Starred</span>
			</div>
		)}
	</div>
);

export default ChatMessageMeta;
