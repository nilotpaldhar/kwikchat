import { cn } from "@/utils/general/cn";

const Block = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={cn("flex flex-col", className)} {...props} />
);
Block.displayName = "Block";

const BlockTitle = ({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
	<h3
		className={cn(
			"select-none text-xs font-semibold uppercase leading-5 text-neutral-900 dark:text-neutral-200",
			className
		)}
		{...props}
	>
		{children}
	</h3>
);
BlockTitle.displayName = "BlockTitle";

const BlockDescription = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn(
			"select-none text-sm leading-5 text-neutral-500 dark:text-neutral-400",
			className
		)}
		{...props}
	/>
);
BlockDescription.displayName = "BlockDescription";

const BlockContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={className} {...props} />
);
BlockContent.displayName = "BlockContent";

export { Block, BlockTitle, BlockDescription, BlockContent };
