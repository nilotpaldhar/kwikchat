import type { LucideIcon } from "lucide-react";
import { cn } from "@/utils/general/cn";

const FeatureCard = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
	<article className={cn("p-2", className)} {...props} />
);
FeatureCard.displayName = "FeatureCard";

const FeatureCardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
	<header className={cn("flex items-center justify-center pb-4 pt-2", className)} {...props} />
);
FeatureCardHeader.displayName = "FeatureCardHeader";

interface FeatureCardIconProps {
	icon: LucideIcon;
	size?: number;
	className?: string;
}
const FeatureCardIcon = ({ icon: Icon, size = 32, className }: FeatureCardIconProps) => (
	<span
		className={cn(
			"flex size-14 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-900",
			className
		)}
	>
		<Icon size={size} />
	</span>
);
FeatureCardIcon.displayName = "FeatureCardIcon";

const FeatureCardBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={cn("space-y-2 py-4 text-center", className)} {...props} />
);
FeatureCardBody.displayName = "FeatureCardBody";

const FeatureCardTitle = ({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
	<h3 className={cn("text-xl font-bold text-neutral-900", className)} {...props}>
		{children}
	</h3>
);
FeatureCardTitle.displayName = "FeatureCardTitle";

const FeatureCardDescription = ({
	className,
	...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
	<p
		className={cn(
			"mx-auto max-w-60 px-1 text-sm font-normal text-neutral-700 sm:text-base md:max-w-72 md:px-4",
			className
		)}
		{...props}
	/>
);
FeatureCardDescription.displayName = "FeatureCardDescription";

export {
	FeatureCard,
	FeatureCardHeader,
	FeatureCardIcon,
	FeatureCardBody,
	FeatureCardTitle,
	FeatureCardDescription,
};
