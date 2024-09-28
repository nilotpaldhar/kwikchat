"use client";

import type { CompleteMessage } from "@/types";

import ChatMessageText from "@/app/messenger/(routes)/chats/_components/chat-message/text";
import ChatMessageImage from "@/app/messenger/(routes)/chats/_components/chat-message/image";

import { cn } from "@/utils/general/cn";

interface ChatMessageDateGroupProps {
	date: string;
	currentUserId: string;
	messages: CompleteMessage[];
	className?: string;
}

const ChatMessageDateGroup = ({
	date,
	currentUserId,
	messages,
	className,
}: ChatMessageDateGroupProps) => (
	<div className={cn("flex flex-col gap-y-14", className)}>
		<div className="relative flex justify-center">
			<div className="relative z-20 max-w-max rounded-lg bg-surface-light-100 px-3 py-1 shadow-md dark:bg-surface-dark-400">
				<span className="block text-sm font-medium capitalize text-neutral-500 dark:text-neutral-400">
					{date}
				</span>
			</div>
			<div className="absolute left-0 right-0 top-1/2 z-10 h-px -translate-y-1/2 transform border-t border-dashed border-neutral-300 dark:border-neutral-800" />
		</div>
		<ul className="flex flex-col-reverse gap-y-4">
			{messages.map((message) => {
				const content = message.textMessage?.content ?? "";
				const isSender = currentUserId === message.senderId;

				return (
					<li key={message.id}>
						{message.type === "text" && (
							<ChatMessageText
								content={content}
								isSender={isSender}
								timestamp={message.createdAt}
							/>
						)}
						{message.type === "image" && <ChatMessageImage />}
					</li>
				);
			})}
		</ul>
	</div>
);

export default ChatMessageDateGroup;
