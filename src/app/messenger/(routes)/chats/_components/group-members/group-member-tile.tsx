"use client";

import type { GroupMember } from "@/types";

import { MemberRole } from "@prisma/client";
import { UserRoundCog, XIcon } from "lucide-react";

import UserAvatar from "@/components/user/user-avatar";
import GroupMemberAction from "@/app/messenger/(routes)/chats/_components/group-members/group-member-action";

import useGroupMembershipStore from "@/store/use-group-membership-store";

import { cn } from "@/utils/general/cn";
import generateUserAvatarFallback from "@/utils/user/generate-user-avatar-fallback";

interface GroupMemberTileProps extends GroupMember {
	currentUserId?: string;
	className?: string;
	onUpdateRole?: ({ memberId, memberRole }: { memberId: string; memberRole: MemberRole }) => void;
	onRemove?: ({ memberId }: { memberId: string }) => void;
}

const GroupMemberTile = ({
	id: memberId,
	role,
	user,
	currentUserId,
	className,
	onUpdateRole = () => {},
	onRemove = () => {},
}: GroupMemberTileProps) => {
	const isGroupAdmin = useGroupMembershipStore().membership?.role === MemberRole.admin;

	const { avatar, displayName, name, username } = user;
	const fallback = generateUserAvatarFallback({ user });

	const hasAdminRole = role === MemberRole.admin;
	const isCurrentUser = currentUserId === user.id;

	return (
		<div className={cn("rounded-lg bg-white dark:bg-surface-dark-400", className)}>
			<div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-3 py-1.5">
				<UserAvatar
					src={avatar}
					fallback={fallback?.toUpperCase() as string}
					wrapperClassName="dark:bg-neutral-800"
					indicatorClassName="dark:ring-surface-dark-400"
				/>
				<div className="flex flex-1 flex-col space-y-1">
					<div className="flex max-w-28 items-center space-x-1 truncate text-sm font-medium leading-6 text-neutral-900 dark:text-neutral-300 sm:max-w-40">
						<span>{displayName ?? name ?? username}</span>
						{isCurrentUser && <span>(You)</span>}
					</div>
					{hasAdminRole && (
						<div className="max-w-max rounded bg-green-100 p-1 text-[10px] font-medium leading-none text-green-600 dark:bg-green-600 dark:text-green-100">
							admin
						</div>
					)}
				</div>
				{isGroupAdmin && (
					<div className="flex items-center space-x-1">
						<GroupMemberAction
							icon={UserRoundCog}
							tooltipText={hasAdminRole ? "Revert to Member" : "Set as Admin"}
							srText="Toggle Member Role"
							className={cn(
								!hasAdminRole && "bg-green-50 text-green-600 hover:bg-green-100",
								hasAdminRole && "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
							)}
							onClick={() =>
								onUpdateRole({
									memberId,
									memberRole: hasAdminRole ? MemberRole.member : MemberRole.admin,
								})
							}
						/>
						{!isCurrentUser && (
							<GroupMemberAction
								icon={XIcon}
								tooltipText="Remove Member"
								srText="Remove Member"
								className="bg-red-50 text-red-600 hover:bg-red-100"
								onClick={() => onRemove({ memberId })}
							/>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default GroupMemberTile;
