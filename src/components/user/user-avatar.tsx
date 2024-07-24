import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/utils/general/cn";

export interface UserAvatarProps {
	src: string | null;
	alt?: string;
	placeholder?: string;
	fallback: string;
	status?: "online" | "offline";
	className?: string;
	wrapperClassName?: string;
	indicatorClassName?: string;
}

const UserAvatar = ({
	src,
	alt,
	placeholder = "/placeholder/user.png",
	fallback,
	status = "offline",
	className,
	wrapperClassName,
	indicatorClassName,
}: UserAvatarProps) => (
	<div
		className={cn(
			"relative flex justify-center items-center size-11 rounded-full bg-neutral-100 dark:bg-neutral-900",
			wrapperClassName
		)}
	>
		<Avatar className={cn("size-9", className)}>
			<AvatarImage src={src ?? placeholder} alt={alt ?? "User Avatar"} />
			<AvatarFallback>{fallback}</AvatarFallback>
		</Avatar>
		<span
			className={cn(
				"absolute bottom-1 right-1 flex justify-center items-center size-2 rounded-full opacity-0 scale-0 transition-all duration-1000 bg-primary-400 ring-2 ring-surface-light-100 ring-offset-surface-light-100 dark:ring-surface-dark-600 dark:ring-offset-surface-dark-600",
				status === "online" && "opacity-100 scale-100",
				indicatorClassName
			)}
		>
			<span className="sr-only">{status}</span>
		</span>
	</div>
);

export default UserAvatar;
