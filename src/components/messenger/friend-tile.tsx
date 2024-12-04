/* eslint-disable jsx-a11y/click-events-have-key-events */

"use client";

import type { FriendWithFriendship } from "@/types";

import { useState } from "react";

import { MessageCircle } from "lucide-react";
import Checkbox from "@/components/ui/checkbox";
import UserAvatar from "@/components/user/user-avatar";

import { cn } from "@/utils/general/cn";

interface FriendTileProps extends FriendWithFriendship {
	defaultSelected?: boolean;
	showCheckbox?: boolean;
	className?: string;
	onChange?: (friendId: string, selected: boolean) => void;
}

const FriendTile = ({
	defaultSelected = false,
	showCheckbox = true,
	className,
	onChange,
	...friend
}: FriendTileProps) => {
	const [selected, setSelected] = useState(defaultSelected);

	const { avatar, displayName, username } = friend;
	const fallback = displayName ? displayName.charAt(0) : username?.charAt(0);

	const handleClick = () => {
		setSelected(!selected);
		if (onChange) onChange(friend.id, !selected);
	};

	return (
		<div
			tabIndex={0}
			role="button"
			onClick={handleClick}
			onKeyDown={(evt) => {
				if (evt.key === "Enter") handleClick();
			}}
			className={cn(
				"flex w-full cursor-pointer select-none items-center px-4 text-left transition hover:bg-neutral-100 focus-visible:bg-neutral-100 focus-visible:outline-none dark:hover:bg-neutral-800 dark:focus-visible:bg-neutral-800",
				className
			)}
		>
			<div className="flex flex-1 items-center space-x-5 border-b border-neutral-200 py-3 dark:border-neutral-800">
				{showCheckbox && (
					<Checkbox
						checked={selected}
						disabled
						className="disabled:cursor-pointer disabled:opacity-100"
					/>
				)}
				<div className="flex flex-1 items-center space-x-3">
					<div>
						<UserAvatar
							src={avatar}
							fallback={fallback as string}
							wrapperClassName="dark:bg-neutral-800"
						/>
					</div>
					<div className="flex-1">
						<div className="text-sm font-medium leading-6">
							<div className="max-w-32 truncate">{displayName}</div>
						</div>
						<div className="text-xs font-semibold leading-5 text-neutral-500 dark:text-neutral-400">
							<div className="max-w-32 truncate">&#64;{username}</div>
						</div>
					</div>
					<span className="flex size-7 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
						<MessageCircle size={14} />
					</span>
				</div>
			</div>
		</div>
	);
};

export default FriendTile;
