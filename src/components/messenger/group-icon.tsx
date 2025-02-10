import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PLACEHOLDER_GROUP_IMAGE } from "@/constants/media";
import { cn } from "@/utils/general/cn";

export interface GroupIconProps {
	src: string | null;
	alt?: string;
	placeholder?: string;
	fallback: string;
	className?: string;
	wrapperClassName?: string;
	wrapperStyle?: React.CSSProperties;
	style?: React.CSSProperties;
}

const GroupIcon = ({
	src,
	alt,
	placeholder = PLACEHOLDER_GROUP_IMAGE,
	fallback,
	className,
	wrapperClassName,
	style,
	wrapperStyle,
}: GroupIconProps) => (
	<div
		className={cn(
			"relative flex size-20 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-900",
			wrapperClassName
		)}
		style={wrapperStyle}
	>
		<Avatar className={cn("size-16", className)} style={style}>
			<AvatarImage src={src ?? placeholder} alt={alt ?? "Group Icon"} />
			<AvatarFallback>{fallback}</AvatarFallback>
		</Avatar>
	</div>
);

export default GroupIcon;
