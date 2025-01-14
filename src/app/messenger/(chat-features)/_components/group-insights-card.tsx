"use client";

import type { GroupOverview } from "@/types";
import { MemberRole } from "@prisma/client";

import { Clock, User, Pencil, Camera } from "lucide-react";

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

import GroupMembers from "@/app/messenger/(chat-features)/_components/group-members";

import useGroupMembershipStore from "@/store/use-group-membership-store";
import useMessengerDialogStore from "@/store/use-messenger-dialog-store";

import formatJoining from "@/utils/user/format-joining";

interface GroupInsightsCardProps {
	overview: GroupOverview;
}

const GroupInsightsCard = ({ overview }: GroupInsightsCardProps) => {
	const isGroupAdmin = useGroupMembershipStore().membership?.role === MemberRole.admin;
	const onOpenDialog = useMessengerDialogStore().onOpen;

	const { name, description, icon, members, createdAt, creator } = overview;

	const fallback = name.charAt(0);
	const creationDate = formatJoining(new Date(createdAt));
	const bannerColor = overview.bannerColor ?? "#27ae80";
	const creatorName = creator.displayName ?? creator.username;
	const totalMembers = `${members.total} ${members.total > 1 ? "Members" : "Member"}`;

	return (
		<Profile className="dark:bg-surface-dark-400">
			<ProfileHeader className="group">
				<ProfileBanner color={bannerColor} />
				<ProfileAvatar
					src={icon ?? "/placeholder/group.png"}
					fallback={fallback?.toUpperCase()}
					status="offline"
					wrapperClassName="dark:bg-surface-dark-400"
				/>

				{isGroupAdmin && (
					<>
						<div className="absolute right-4 top-4">
							<Button
								size="icon"
								variant="outline"
								onClick={() =>
									onOpenDialog("EDIT_GROUP_BANNER", { groupConversationToEdit: overview })
								}
								className="size-7 rounded-full border-transparent bg-black/20 text-white hover:bg-black/30 dark:border-transparent dark:bg-black/20 dark:hover:bg-black/30"
							>
								<Pencil size={12} />
								<span className="sr-only">Edit Profile</span>
							</Button>
						</div>

						<div className="absolute left-5 top-[56%] opacity-0 transition duration-300 group-hover:opacity-100">
							<div className="relative flex size-20 items-center justify-center rounded-full">
								<div className="size-[68px] overflow-hidden rounded-full bg-neutral-900/70">
									<button
										type="button"
										onClick={() =>
											onOpenDialog("EDIT_GROUP_ICON", { groupConversationToEdit: overview })
										}
										className="flex h-full w-full flex-col items-center justify-center space-y-1.5 text-neutral-300"
									>
										<Camera size={20} />
										<span className="truncate text-center text-[8px] lowercase leading-none">
											change icon
										</span>
									</button>
								</div>
							</div>
						</div>
					</>
				)}
			</ProfileHeader>
			<ProfileContent className="dark:[&>*:first-child]:bg-surface-dark-300">
				<div className="flex flex-col space-y-4">
					<div className="flex items-start justify-between">
						<Block>
							<BlockTitle className="text-base font-semibold capitalize leading-7">
								<span title={name} className="block max-w-40 truncate sm:max-w-52">
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

						{isGroupAdmin && (
							<Button
								size="icon"
								variant="outline"
								onClick={() =>
									onOpenDialog("EDIT_GROUP_DETAILS", { groupConversationToEdit: overview })
								}
								className="h-max w-max border-none bg-transparent p-0 text-neutral-500 hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent"
							>
								<Pencil size={16} />
								<span className="sr-only">Edit Group Details</span>
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

// sophia.garcia@example.com
// http://localhost:3000/messenger/chats/cm4h5l9oa0001uxu4raddzlfb
