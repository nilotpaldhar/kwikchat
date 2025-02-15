import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/utils/general/cn";

const FoterMenu = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={className} {...props} />
);
FoterMenu.displayName = "FoterMenu";

const FoterMenuContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={cn("flex max-w-max flex-col space-y-3", className)} {...props} />
);
FoterMenuContent.displayName = "FoterMenuContent";

const FoterMenuLabel = ({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
	<h3 className={cn("pb-6 text-xs font-semibold leading-5 text-neutral-400", className)} {...props}>
		{children}
	</h3>
);
FoterMenuLabel.displayName = "FoterMenuLabel";

interface FoterMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	asChild?: boolean;
}
const FoterMenuButton = React.forwardRef<HTMLButtonElement, FoterMenuButtonProps>(
	({ className, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={cn(
					"block max-w-max whitespace-nowrap rounded-sm py-px text-left text-base font-medium text-current ring-offset-surface-dark-600 transition-colors duration-150 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-700 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
					className
				)}
				ref={ref}
				{...props}
			/>
		);
	}
);
FoterMenuButton.displayName = "FoterMenuButton";

export { FoterMenu, FoterMenuContent, FoterMenuLabel, FoterMenuButton };
