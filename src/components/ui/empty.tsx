import { LucideIcon, LucideProps } from "lucide-react";
import { cn } from "@/utils/general/cn";

const Empty = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={cn("flex flex-col items-center justify-center", className)} {...props} />
);
Empty.displayName = "Empty";

interface EmptyIconProps extends LucideProps {
	icon: LucideIcon;
}

const EmptyIcon = ({ icon: Icon, size = 96, className, ...props }: EmptyIconProps) => (
	<Icon
		size={size}
		className={cn("text-neutral-200 dark:text-neutral-800", className)}
		{...props}
	/>
);
EmptyIcon.displayName = "EmptyIcon";

const EmptyTitle = ({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
	<h2 className={cn("mt-5 text-center text-base font-semibold", className)} {...props}>
		{children}
	</h2>
);
EmptyTitle.displayName = "EmptyTitle";

const EmptyDescription = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn(
			"mt-2 max-w-md text-center text-sm text-neutral-500 dark:text-neutral-400",
			className
		)}
		{...props}
	/>
);
EmptyDescription.displayName = "EmptyDescription";

const EmptyContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={cn("mt-5", className)} {...props} />
);
EmptyContent.displayName = "EmptyContent";

export { Empty, EmptyIcon, EmptyTitle, EmptyDescription, EmptyContent };
