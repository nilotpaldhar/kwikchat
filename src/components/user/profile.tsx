import UserAvatar, { type UserAvatarProps } from "@/components/user/user-avatar";

import { cn } from "@/utils/general/cn";

const Profile = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn(
			"relative overflow-hidden bg-surface-light-100 dark:bg-surface-dark-500",
			className
		)}
		{...props}
	/>
);
Profile.displayName = "Profile";

const ProfileHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={cn("relative", className)} {...props} />
);
ProfileHeader.displayName = "ProfileHeader";

interface ProfileBannerProps extends React.HTMLAttributes<HTMLDivElement> {
	color?: string;
}
const ProfileBanner = ({ color = "#27ae80", className, ...props }: ProfileBannerProps) => (
	<div className={cn("w-full h-24", className)} style={{ backgroundColor: color }} {...props} />
);
ProfileBanner.displayName = "ProfileBanner";

interface ProfileAvatarProps extends UserAvatarProps {}
const ProfileAvatar = ({ ...props }: ProfileAvatarProps) => (
	<div className="absolute top-[56%] left-5">
		<UserAvatar
			className="size-[68px]"
			wrapperClassName="size-20 bg-white dark:bg-surface-dark-500"
			indicatorClassName="bottom-2 right-2 size-3 ring-4 dark:ring-surface-dark-500"
			{...props}
		/>
	</div>
);
ProfileAvatar.displayName = "ProfileAvatar";

const ProfileContent = ({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={cn("mt-[38px] p-5", className)} {...props}>
		<div className="p-4 bg-surface-light-200 dark:bg-surface-dark-400 rounded-xl">{children}</div>
	</div>
);
ProfileContent.displayName = "ProfileContent";

export { Profile, ProfileHeader, ProfileBanner, ProfileAvatar, ProfileContent };
