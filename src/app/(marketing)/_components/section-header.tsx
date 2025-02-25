import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/utils/general/cn";

const SectionHeader = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
	<header
		className={cn("flex flex-col items-center space-y-3 text-center lg:space-y-4", className)}
		{...props}
	/>
);
SectionHeader.displayName = "SectionHeader";

const SectionBadge = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
	<span
		className={cn(
			"flex items-center justify-center space-x-1.5 whitespace-nowrap rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold !leading-none text-primary-400 md:py-2 md:text-sm",
			className
		)}
		{...props}
	/>
);
SectionBadge.displayName = "SectionBadge";

interface SectionTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
	asChild?: boolean;
}
const SectionTitle = ({ children, className, asChild = false, ...props }: SectionTitleProps) => {
	const Comp = asChild ? Slot : "h2";

	return (
		<Comp
			className={cn(
				"text-xl font-extrabold tracking-[1px] text-neutral-900 md:text-2xl lg:text-3xl",
				className
			)}
			{...props}
		>
			{children}
		</Comp>
	);
};
SectionTitle.displayName = "SectionTitle";

const SectionDescription = ({
	className,
	...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
	<p
		className={cn(
			"max-w-lg text-sm font-semibold leading-6 text-neutral-500 md:text-base lg:text-lg",
			className
		)}
		{...props}
	/>
);
SectionDescription.displayName = "SectionDescription";

export { SectionHeader, SectionBadge, SectionTitle, SectionDescription };
