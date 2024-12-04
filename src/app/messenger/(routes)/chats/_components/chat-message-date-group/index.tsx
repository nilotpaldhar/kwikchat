"use client";

import type { CompleteMessage } from "@/types";

import { useEffect } from "react";

import ChatMessageFactory from "@/app/messenger/(routes)/chats/_components/chat-message-factory";
import SenderInfo from "@/app/messenger/(routes)/chats/_components/chat-message-date-group/sender-info";

import { useMessagesSeenStatus } from "@/hooks/tanstack-query/use-message";
import { cn } from "@/utils/general/cn";

interface ChatMessageDateGroupProps {
	date: string;
	conversationId: string;
	currentUserId: string;
	messages: CompleteMessage[];
	className?: string;
}

const ChatMessageDateGroup = ({
	date,
	conversationId,
	currentUserId,
	messages,
	className,
}: ChatMessageDateGroupProps) => {
	const { mutate } = useMessagesSeenStatus();

	useEffect(() => {
		// Array to hold IDs of messages that need to be marked as seen
		const messageIds: string[] = [];

		// Loop through messages to find unseen messages sent by other members
		messages.forEach((message) => {
			if (message.senderId !== currentUserId && !message.seenByMembers.includes(currentUserId)) {
				messageIds.push(message.id);
			}
		});

		// If there are any unseen messages, update their seen status
		if (messageIds.length > 0) mutate({ conversationId, messageIds });
	}, [conversationId, currentUserId, messages, mutate]);

	return (
		<div className={cn("flex flex-col gap-y-14", className)}>
			<div className="relative flex select-none justify-center">
				<div className="relative z-20 max-w-max rounded-lg bg-surface-light-100 px-3 py-1 shadow-md dark:bg-surface-dark-400">
					<span className="block text-sm font-medium capitalize text-neutral-500 dark:text-neutral-400">
						{date}
					</span>
				</div>
				<div className="absolute left-0 right-0 top-1/2 z-10 h-px -translate-y-1/2 transform border-t border-dashed border-neutral-300 dark:border-neutral-800" />
			</div>
			<ul className="flex flex-col-reverse gap-y-8">
				{messages.map((message, index) => {
					const { sender, conversation, id: messageId } = message;
					const showAvatar = conversation.isGroup && sender.id !== currentUserId;
					const shouldDisplayAvatar = showAvatar && sender.id !== messages[index + 1]?.senderId;

					return (
						<li key={messageId}>
							{shouldDisplayAvatar && <SenderInfo sender={sender} />}
							<div className={cn(showAvatar && "pl-[52px]")}>
								<ChatMessageFactory message={message} currentUserId={currentUserId} />
							</div>
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default ChatMessageDateGroup;
