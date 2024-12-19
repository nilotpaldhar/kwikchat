"use client";

import type { FriendWithFriendship } from "@/types";

import UserAvatar from "@/components/user/user-avatar";
import generateUserAvatarFallback from "@/utils/user/generate-user-avatar-fallback";

interface OnlineFriendItemProps extends FriendWithFriendship {
	onClick?: (friendId: string) => void;
}

const OnlineFriendItem = ({ onClick = () => {}, ...friend }: OnlineFriendItemProps) => {
	const { avatar, displayName, username } = friend;
	const fallback = generateUserAvatarFallback({ user: friend });

	return (
		<button
			type="button"
			onClick={() => onClick(friend.id)}
			className="flex size-11 items-center justify-center rounded-full ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-0 dark:ring-offset-surface-dark-600 dark:focus-visible:ring-neutral-600"
		>
			<UserAvatar src={avatar} fallback={fallback} status="online" />
			<span className="sr-only">{displayName ?? username}</span>
		</button>
	);
};

export default OnlineFriendItem;
