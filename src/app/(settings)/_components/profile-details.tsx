"use client";

import type { User } from "@prisma/client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Profile,
	ProfileHeader,
	ProfileBanner,
	ProfileAvatar,
	ProfileContent,
} from "@/components/user/profile";
import { Block, BlockTitle, BlockDescription } from "@/components/ui/block";

import { cn } from "@/utils/general/cn";
import useSettingsDialogStore from "@/store/use-settings-dialog-store";

interface ProfileDetailsProps {
	user: User;
	isOAuth: boolean;
	className?: string;
}

const ProfileDetails = ({ user, isOAuth, className }: ProfileDetailsProps) => {
	const { onOpen } = useSettingsDialogStore();
	const fallback = user.name ? user.name.charAt(0) : user.username?.charAt(0);

	return (
		<div
			className={cn(
				"relative overflow-hidden rounded-xl shadow-[0_8px_16px_rgba(0,0,0,0.1)]",
				className
			)}
		>
			<Profile>
				<ProfileHeader>
					<ProfileBanner color={user.banner_color ?? "#27ae80"} />
					<ProfileAvatar
						src={user.avatar}
						fallback={fallback?.toUpperCase() as string}
						status="online"
					/>
				</ProfileHeader>
				<ProfileContent>
					<div className="flex flex-col space-y-4">
						<div className="flex items-start justify-between">
							<Block className="space-y-0.5">
								<BlockTitle>Display Name</BlockTitle>
								<BlockDescription>{user.displayName}</BlockDescription>
							</Block>
							<Button variant="secondary" className="px-3 py-1 h-8">
								<Link href="/account-profile">Edit</Link>
							</Button>
						</div>

						<div className="flex items-start justify-between">
							<Block className="space-y-0.5">
								<BlockTitle>Username</BlockTitle>
								<BlockDescription>{user.username}</BlockDescription>
							</Block>
							<Button
								variant="secondary"
								className="px-3 py-1 h-8"
								onClick={() => onOpen("UPDATE_USERNAME")}
								disabled={isOAuth}
							>
								Edit
							</Button>
						</div>

						<div className="flex items-start justify-between">
							<Block className="space-y-0.5">
								<BlockTitle>Email</BlockTitle>
								<BlockDescription>{user.email}</BlockDescription>
							</Block>
							<Button variant="secondary" className="px-3 py-1 h-8" disabled>
								Edit
							</Button>
						</div>
					</div>
				</ProfileContent>
			</Profile>
			<Button variant="secondary" className="absolute top-4 right-4" asChild>
				<Link href="/account-profile">Edit User Profile</Link>
			</Button>
		</div>
	);
};

export default ProfileDetails;
