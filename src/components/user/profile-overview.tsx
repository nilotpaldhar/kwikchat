"use client";

import type { UserProfile } from "@/types";

import {
	Profile,
	ProfileHeader,
	ProfileBanner,
	ProfileAvatar,
	ProfileContent,
} from "@/components/user/profile";
import ProfileInfo from "@/components/user/profile-info";

import formatJoining from "@/utils/user/format-joining";

interface ProfileOverviewProps {
	user: UserProfile;
	copyableUsername?: boolean;
	showLogout?: boolean;
	className?: string;
	classNames?: {
		profileHeader?: string;
		profileBanner?: string;
		profileAvatar: {
			className?: string;
			wrapperClassName?: string;
			indicatorClassName?: string;
		};
		profileContent?: string;
		profileInfo?: string;
	};
}

const ProfileOverview = ({
	user,
	copyableUsername,
	showLogout,
	className,
	classNames,
}: ProfileOverviewProps) => {
	const fallback = user.name ? user.name.charAt(0) : user.username?.charAt(0);

	return (
		<Profile className={className}>
			<ProfileHeader className={classNames?.profileHeader}>
				<ProfileBanner
					color={user.banner_color ?? "#27ae80"}
					className={classNames?.profileBanner}
				/>
				<ProfileAvatar
					src={user.avatar}
					fallback={fallback?.toUpperCase() as string}
					status={user.isOnline ? "online" : "offline"}
					className={classNames?.profileAvatar.className}
					wrapperClassName={classNames?.profileAvatar.wrapperClassName}
					indicatorClassName={classNames?.profileAvatar.indicatorClassName}
				/>
			</ProfileHeader>
			<ProfileContent className={classNames?.profileContent}>
				<ProfileInfo
					name={user.displayName as string}
					username={user.username as string}
					email={user.email as string}
					about={user.bio}
					joiningDate={formatJoining(new Date(user.createdAt))}
					copyableUsername={copyableUsername}
					showLogout={showLogout}
					className={classNames?.profileInfo}
				/>
			</ProfileContent>
		</Profile>
	);
};

export default ProfileOverview;
