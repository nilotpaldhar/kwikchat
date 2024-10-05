"use client";

import { useState } from "react";

import { CheckCheck, Ban, Star } from "lucide-react";
import ChatMessageActions from "@/app/messenger/(routes)/chats/_components/chat-message/actions";

import { cn } from "@/utils/general/cn";
import useMessengerDialogStore from "@/store/use-messenger-dialog-store";

interface ChatMessageTextProps {
	id: string;
	conversationId: string;
	content: string;
	timestamp: string;
	isSender: boolean;
	isRead?: boolean;
	isEdited?: boolean;
	isStarred?: boolean;
	isDeleted?: boolean;
}

const ChatMessageText = ({
	id,
	conversationId,
	content,
	timestamp,
	isSender,
	isRead = false,
	isEdited = false,
	isStarred = false,
	isDeleted = false,
}: ChatMessageTextProps) => {
	const openEditMessageDialog = useMessengerDialogStore().onOpen;

	const [isActionsOpen, setIsActionsOpen] = useState(false);

	// Function to toggle action visibility for keyboard and touch devices
	const toggleActions = (state: boolean) => {
		setIsActionsOpen(state);
	};

	const handleEdit = () => {
		openEditMessageDialog("EDIT_MESSAGE", {
			messageToEdit: { messageid: id, conversationId, content, timestamp },
		});
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
			</div>
			<ChatMessageActions isOpen={isActionsOpen} isSender={isSender} onEdit={handleEdit} />
		</div>
	);
};

export default ChatMessageText;
