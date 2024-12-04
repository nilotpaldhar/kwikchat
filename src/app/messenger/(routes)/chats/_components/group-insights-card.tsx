"use client";

import type { GroupOverview } from "@/types";

import { Clock, User, Pen } from "lucide-react";

import {
	Profile,
	ProfileHeader,
	ProfileBanner,
	ProfileAvatar,
	ProfileContent,
} from "@/components/user/profile";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import ProfileBio from "@/components/user/profile-bio";
import { Block, BlockTitle, BlockDescription } from "@/components/ui/block";

import GroupMembers from "@/app/messenger/(routes)/chats/_components/group-members";

import formatJoining from "@/utils/user/format-joining";

interface GroupInsightsCardProps {
	overview: GroupOverview;
	editable?: boolean;
	onEdit?: () => void;
}

const GroupInsightsCard = ({
	overview,
	editable = false,
	onEdit = () => {},
}: GroupInsightsCardProps) => {
	const { name, description, icon, members, createdAt, creator } = overview;

	const fallback = name.charAt(0);
	const creationDate = formatJoining(new Date(createdAt));
	const creatorName = creator.displayName ?? creator.username;
	const totalMembers = `${members.total} ${members.total > 1 ? "Members" : "Member"}`;

	return (
		<Profile className="dark:bg-surface-dark-400">
			<ProfileHeader>
				<ProfileBanner color="#27ae80" />
				<ProfileAvatar
					src={icon ?? "/placeholder/group.png"}
					fallback={fallback?.toUpperCase()}
					status="offline"
					wrapperClassName="dark:bg-surface-dark-400"
				/>
			</ProfileHeader>
			<ProfileContent className="dark:[&>*:first-child]:bg-surface-dark-300">
				<div className="flex flex-col space-y-4">
					<div className="flex items-start justify-between">
						<Block>
							<BlockTitle className="text-base font-semibold capitalize leading-7">
								<span title={name} className="block max-w-52 truncate">
									{name}
								</span>
							</BlockTitle>
							<BlockDescription className="text-xs font-medium leading-3">
								<div className="flex items-center space-x-2 leading-none">
									<span>Group</span>
									<span className="block size-1 rounded-full bg-neutral-300 dark:bg-neutral-500" />
									<span>{totalMembers}</span>
								</div>
							</BlockDescription>
						</Block>

						{editable && (
							<Button
								variant="outline"
								size="icon"
								className="h-max w-max border-none bg-transparent p-0 text-neutral-500 hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent"
								onClick={onEdit}
							>
								<Pen size={16} />
								<span className="sr-only">Copy Username</span>
							</Button>
						)}
					</div>
					<Divider type="solid" className="before:border-neutral-300" />
					<div className="flex flex-col space-y-5">
						<Block className="space-y-0.5">
							<BlockTitle>Description</BlockTitle>
							<BlockDescription className="text-xs leading-4">
								{description ? <ProfileBio bio={description} /> : <span>N/A</span>}
							</BlockDescription>
						</Block>
						<Block className="space-y-0.5">
							<BlockTitle>Created At</BlockTitle>
							<BlockDescription className="flex items-center space-x-1 text-xs leading-3">
								<Clock size={12} />
								<span>{creationDate}</span>
							</BlockDescription>
						</Block>
						<Block className="space-y-0.5">
							<BlockTitle>Created By</BlockTitle>
							<BlockDescription className="flex items-center space-x-1 text-xs leading-3">
								<User size={12} />
								<span>{creatorName}</span>
							</BlockDescription>
						</Block>
						<Block className="space-y-2">
							<BlockTitle>{totalMembers}</BlockTitle>
							<BlockDescription>
								<GroupMembers conversationId={overview.id} total={members.total} />
							</BlockDescription>
						</Block>
					</div>
				</div>
			</ProfileContent>
		</Profile>
	);
};

export default GroupInsightsCard;
