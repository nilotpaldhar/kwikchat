"use client";

import type { FriendWithFriendship } from "@/types";

import { useRouter, usePathname } from "next/navigation";
import { MessageCircle, MoreVertical } from "lucide-react";

import UserAvatar from "@/components/user/user-avatar";
import MoreActions from "@/app/messenger/(friends-management)/_components/friend-tile/more-actions";
import {
	ActionButton,
	ActionButtonWithTooltip,
} from "@/app/messenger/(friends-management)/_components/action-button";

import useMessengerDialogStore from "@/store/use-messenger-dialog-store";

import { cn } from "@/utils/general/cn";
import buildOpenChatUrl from "@/utils/messenger/build-open-chat-url";
import generateUserAvatarFallback from "@/utils/user/generate-user-avatar-fallback";

interface FriendTileProps extends FriendWithFriendship {
	className?: string;
}

const FriendTile = ({ className, ...friend }: FriendTileProps) => {
	const router = useRouter();
	const pathname = usePathname();
	const { onOpen } = useMessengerDialogStore();

	const { avatar, displayName, username } = friend;
	const fallback = generateUserAvatarFallback({ user: friend });

	const handleInitChat = () => {
		const url = buildOpenChatUrl(friend.id, pathname);
		router.push(url);
	};

	return (
		<div
			className={cn(
				"group flex select-none items-center space-x-3 rounded-lg px-2 py-3 transition hover:bg-neutral-100 dark:hover:bg-neutral-900",
				className
			)}
		>
			<div>
				<UserAvatar src={avatar} fallback={fallback as string} />
			</div>
			<div className="flex-1">
				<div className="text-sm font-medium leading-6">
					<div className="line-clamp-1">{displayName}</div>
				</div>
				<div className="text-xs font-semibold leading-5 text-neutral-500 dark:text-neutral-400">
					<div className="line-clamp-1">&#64;{username}</div>
				</div>
			</div>
			<div className="flex items-center space-x-2">
				<ActionButtonWithTooltip
					icon={MessageCircle}
					tooltipText="Message"
					srText={`Message ${username}`}
					onClick={handleInitChat}
				/>
				<MoreActions
					onBlock={() => onOpen("BLOCK_FRIEND", { friendToBlock: friend })}
					onRemoveFriend={() => onOpen("REMOVE_FRIEND", { friendToRemove: friend })}
				>
					<ActionButton icon={MoreVertical} srText="More" />
				</MoreActions>
			</div>
		</div>
	);
};

export default FriendTile;
