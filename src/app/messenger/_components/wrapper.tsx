import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/utils/general/cn";

const Wrapper: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className }) => (
	<div className={cn("flex h-screen", className)}>{children}</div>
);
Wrapper.displayName = "Wrapper";

const WrapperSidePanel: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
	children,
	className,
}) => (
	<div
		className={cn(
			"fixed top-0 z-10 hidden h-full w-full max-w-[260px] flex-1 border-r border-neutral-200 dark:border-neutral-900 md:block lg:max-w-[360px]",
			className
		)}
	>
		{children}
	</div>
);
Wrapper.displayName = "WrapperSidePanel";

const WrapperContentZone: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
	children,
	className,
}) => (
	<div className={cn("flex-1", className)}>
		<div className="pl-0 md:pl-[260px] lg:pl-[360px]">
			<div className="relative">{children}</div>
		</div>
	</div>
);
Wrapper.displayName = "WrapperContentZone";

const WrapperHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className }) => (
	<div
		className={cn(
			"absolute top-0 z-10 h-16 w-full overflow-hidden border-b border-transparent bg-surface-light-100 shadow-header dark:border-neutral-900 dark:bg-surface-dark-600",
			className
		)}
	>
		{children}
	</div>
);
Wrapper.displayName = "WrapperHeader";

const WrapperContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
	children,
	className,
}) => (
	<ScrollArea className="h-screen">
		<div className={cn("mb-20 mt-16 bg-surface-light-100 dark:bg-surface-dark-600", className)}>
			{children}
		</div>
	</ScrollArea>
);
Wrapper.displayName = "WrapperContent";

const WrapperFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className }) => (
	<div
		className={cn(
			"absolute bottom-0 z-10 h-20 w-full overflow-hidden border-t border-transparent bg-surface-light-100 shadow-mobile-nav dark:border-neutral-900 dark:bg-surface-dark-600",
			className
		)}
	>
		{children}
	</div>
);
Wrapper.displayName = "WrapperFooter";

export {
	Wrapper,
	WrapperSidePanel,
	WrapperContentZone,
	WrapperHeader,
	WrapperContent,
	WrapperFooter,
};
