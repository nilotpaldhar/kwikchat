"use client";

import { format } from "date-fns";

import type { BlockedUser } from "@/types";

import { UserMinus2 } from "lucide-react";

import UserAvatar from "@/components/user/user-avatar";
import { ActionButtonWithTooltip } from "@/app/messenger/(friends-management)/_components/action-button";

import { cn } from "@/utils/general/cn";
import { useUnblock } from "@/hooks/tanstack-query/use-block";

interface BlockUserTileProps extends BlockedUser {
	className?: string;
}

const BlockUserTile = ({
	user: { id, avatar, displayName, username },
	blockedAt,
	className,
}: BlockUserTileProps) => {
	const { mutate } = useUnblock();

	const fallback = displayName ? displayName.charAt(0) : username?.charAt(0);
	const blockedAtStr = format(new Date(blockedAt), "dd/MM/yyyy");

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
					<div className="max-w-32 truncate">{displayName}</div>
				</div>
				<div className="text-xs font-semibold leading-5 text-neutral-500 dark:text-neutral-400">
					Blocked on {blockedAtStr}
				</div>
			</div>
			<div className="flex items-center space-x-2">
				<ActionButtonWithTooltip
					icon={UserMinus2}
					tooltipText="Unblock"
					srText={`Unblock ${username}`}
					onClick={() => mutate(id)}
				/>
			</div>
		</div>
	);
};

export default BlockUserTile;
