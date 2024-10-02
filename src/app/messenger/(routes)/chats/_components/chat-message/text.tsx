"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";

import { CheckCheck, Ban } from "lucide-react";
import ChatMessageActions from "@/app/messenger/(routes)/chats/_components/chat-message/actions";

import { cn } from "@/utils/general/cn";

interface ChatMessageTextProps {
	content: string;
	timestamp: Date;
	isSender: boolean;
	isRead?: boolean;
	isDeleted?: boolean;
}

const ChatMessageText = ({
	content,
	timestamp,
	isSender,
	isRead = false,
	isDeleted = false,
}: ChatMessageTextProps) => {
	const [isActionsOpen, setIsActionsOpen] = useState(false);

	// Format the timestamp
	const formattedTime = useMemo(() => format(timestamp, "hh:mm a"), [timestamp]);

	// Function to toggle action visibility for keyboard and touch devices
	const toggleActions = (state: boolean) => {
		setIsActionsOpen(state);
	};

	return (
		<div
			tabIndex={0}
			role="button"
			aria-label="Chat message with actions"
			className={cn(
				"flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 dark:focus-visible:ring-neutral-600",
				isSender ? "justify-end" : "justify-start"
			)}
			onMouseEnter={() => toggleActions(true)}
			onMouseLeave={() => toggleActions(false)}
			onFocus={() => toggleActions(true)}
			onBlur={() => toggleActions(false)}
		>
			<div className={cn("flex flex-col space-y-2", isSender && "order-2")}>
				<div
					className={cn(
						"max-w-56 rounded-xl px-4 py-3 text-sm leading-6 shadow-md sm:max-w-xs lg:max-w-md xl:max-w-xl 3xl:max-w-3xl",
						isSender
							? "rounded-tr-none bg-primary-400 text-neutral-50"
							: "rounded-tl-none bg-surface-light-100 dark:bg-surface-dark-400"
					)}
				>
					<div
						className={cn(
							"flex items-center space-x-1.5",
							isDeleted && "font-semibold italic text-neutral-400",
							isDeleted && isSender && "text-neutral-300"
						)}
					>
						{isDeleted && <Ban size={20} />}
						<div className="flex-1">{content}</div>
					</div>
				</div>
				<div
					className={cn(
						"flex items-center gap-x-1.5 px-1",
						isSender ? "justify-end" : "justify-start"
					)}
				>
					{isSender && (
						<span
							className={cn(
								"order-1 block",
								isRead ? "text-blue-600" : "text-neutral-500 dark:text-neutral-400"
							)}
						>
							<CheckCheck size={14} />
						</span>
					)}
					<span className="block text-xs font-semibold lowercase leading-none text-neutral-500 dark:text-neutral-400">
						{formattedTime}
					</span>
				</div>
			</div>
			<ChatMessageActions isOpen={isActionsOpen} isSender={isSender} />
		</div>
	);
};

export default ChatMessageText;
