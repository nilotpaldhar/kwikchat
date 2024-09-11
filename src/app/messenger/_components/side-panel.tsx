import { ScrollArea } from "@/components/ui/scroll-area";

import { cn } from "@/utils/general/cn";

const SidePanel: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className }) => (
	<div className={cn("", className)}>{children}</div>
);

const SidePanelHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
	children,
	className,
}) => (
	<div
		className={cn(
			"flex h-16 items-center border-b border-neutral-200 px-5 dark:border-neutral-900",
			className
		)}
	>
		{children}
	</div>
);

const SidePanelContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
	children,
	className,
}) => (
	<ScrollArea className="h-[calc(100vh-80px)]">
		<div className={cn("px-5 py-6", className)}>{children}</div>
	</ScrollArea>
);

export { SidePanel, SidePanelHeader, SidePanelContent };
