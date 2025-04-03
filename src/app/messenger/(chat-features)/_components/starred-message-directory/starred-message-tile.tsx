"use client";

import { MessageType } from "@prisma/client";
import type { CompleteMessage } from "@/types";

import { useMemo } from "react";
import { format } from "date-fns";

import UserAvatar from "@/components/user/user-avatar";
import {
	ChatMessageText,
	ChatMessageDocument,
	ChatMessageImage,
} from "@/app/messenger/(chat-features)/_components/chat-message";

import useCurrentUser from "@/hooks/tanstack-query/use-current-user";

import { cn } from "@/utils/general/cn";
import formatDateBasedOnRecency from "@/utils/general/format-date-based-on-recency";

interface StarredMessageTileProps {
	message: CompleteMessage;
}

const StarredMessageTile = ({ message }: StarredMessageTileProps) => {
	const { data } = useCurrentUser();
	const currentUserId = data?.data?.id;

	const { id: senderId, username, avatar, displayName } = message.sender;
	const fallback = displayName ? displayName.charAt(0) : username?.charAt(0);
	const isSender = currentUserId === senderId;

	const formattedDate = useMemo(
		() => formatDateBasedOnRecency(new Date(message.createdAt), false),
		[message.createdAt]
	);
	const formattedTime = useMemo(() => format(message.createdAt, "hh:mm a"), [message.createdAt]);

	return (
		<div className="px-6 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-900">
			<div className="mb-4 flex items-center justify-between space-x-3">
				<div className="flex items-center space-x-2">
					<UserAvatar
						wrapperClassName="size-7"
						className="size-7"
						src={avatar}
						fallback={fallback?.toUpperCase()!}
					/>
					<div className="max-w-32 truncate text-sm font-medium">{displayName || username}</div>
				</div>
				<div className="text-xs font-semibold leading-none text-neutral-500 dark:text-neutral-400">
					{formattedDate}
				</div>
			</div>
			<div className="flex flex-col space-y-2">
				<div className="pl-6">
					{message.type === MessageType.text && (
						<ChatMessageText
							isSender={isSender}
							messageContent={message.textMessage?.content ?? ""}
							className="!max-w-full !rounded-tl-none !rounded-tr-xl"
						/>
					)}
					{message.type === MessageType.document && (
						<ChatMessageDocument
							conversationId={message.conversationId}
							messageId={message.id}
							isSender={isSender}
							attachment={message.documentMessage}
							className={cn(
								"!w-full !rounded-tl-none !rounded-tr-xl",
								!isSender && "dark:bg-surface-dark-300"
							)}
						/>
					)}
					{message.type === MessageType.image && (
						<ChatMessageImage
							conversationId={message.conversationId}
							messageId={message.id}
							isSender={isSender}
							attachments={message.imageMessage}
							className={cn(
								"!w-full !rounded-tl-none !rounded-tr-xl",
								!isSender && "dark:bg-surface-dark-300"
							)}
						/>
					)}
				</div>

				<div className="text-right text-xs font-semibold lowercase leading-none text-neutral-500 dark:text-neutral-400">
					{formattedTime}
				</div>
			</div>
		</div>
	);
};

export default StarredMessageTile;
