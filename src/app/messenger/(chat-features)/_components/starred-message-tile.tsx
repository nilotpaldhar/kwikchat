"use client";

import type { CompleteMessage } from "@/types";

import { useMemo } from "react";
import { format } from "date-fns";

import UserAvatar from "@/components/user/user-avatar";

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
					{message.type === "text" && (
						<div
							className={cn(
								"message-pill !max-w-full !rounded-tl-none",
								currentUserId === senderId
									? "bg-primary-400 text-neutral-50"
									: "bg-surface-light-100 dark:bg-surface-dark-300"
							)}
						>
							{message.textMessage?.content}
						</div>
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
