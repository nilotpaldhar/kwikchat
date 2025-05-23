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
	<div className={cn("h-24 w-full", className)} style={{ backgroundColor: color }} {...props} />
);
ProfileBanner.displayName = "ProfileBanner";

type ProfileAvatarProps = UserAvatarProps;
const ProfileAvatar = ({
	className,
	wrapperClassName,
	indicatorClassName,
	...props
}: ProfileAvatarProps) => (
	<div className="absolute left-5 top-[56%]">
		<UserAvatar
			className={cn("size-[68px]", className)}
			wrapperClassName={cn("size-20 bg-white dark:bg-surface-dark-500", wrapperClassName)}
			indicatorClassName={cn(
				"bottom-2 right-2 size-3 ring-4 dark:ring-surface-dark-500",
				indicatorClassName
			)}
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
		<div className="rounded-xl bg-surface-light-200 p-4 dark:bg-surface-dark-400">{children}</div>
	</div>
);
ProfileContent.displayName = "ProfileContent";

export { Profile, ProfileHeader, ProfileBanner, ProfileAvatar, ProfileContent };
