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
}

const ProfileOverview = ({
	user,
	copyableUsername,
	showLogout,
	className,
}: ProfileOverviewProps) => {
	const fallback = user.name ? user.name.charAt(0) : user.username?.charAt(0);

	return (
		<Profile className={className}>
			<ProfileHeader>
				<ProfileBanner color={user.banner_color ?? "#27ae80"} />
				<ProfileAvatar
					src={user.avatar}
					fallback={fallback?.toUpperCase() as string}
					status="online"
				/>
			</ProfileHeader>
			<ProfileContent>
				<ProfileInfo
					name={user.displayName as string}
					username={user.username as string}
					email={user.email as string}
					about={user.bio}
					joiningDate={formatJoining(new Date(user.createdAt))}
					copyableUsername={copyableUsername}
					showLogout={showLogout}
				/>
			</ProfileContent>
		</Profile>
	);
};

export default ProfileOverview;
