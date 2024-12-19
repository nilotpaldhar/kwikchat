"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { cn } from "@/utils/general/cn";

interface ActionButtonProps {
	icon: LucideIcon;
	srText?: string;
	className?: string;
}

interface ActionButtonWithTooltipProps extends ActionButtonProps {
	onClick?: () => void;
	tooltipText?: string;
}

const btnClaasName =
	"size-7 rounded-full border-transparent bg-neutral-100 hover:bg-neutral-200 dark:border-transparent dark:bg-neutral-900 dark:hover:bg-neutral-800";

const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
	({ icon: Icon, srText, className, ...props }, ref) => (
		<Button
			size="icon"
			variant="outline"
			className={cn(btnClaasName, className)}
			ref={ref}
			{...props}
		>
			<Icon size={14} />
			<span className="sr-only">{srText}</span>
		</Button>
	)
);

const ActionButtonWithTooltip = ({
	icon: Icon,
	tooltipText,
	srText,
	onClick = () => {},
	className,
}: ActionButtonWithTooltipProps) => (
	<TooltipProvider>
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					size="icon"
					variant="outline"
					className={cn(btnClaasName, className)}
					onClick={onClick}
				>
					<Icon size={14} />
					<span className="sr-only">{srText}</span>
				</Button>
			</TooltipTrigger>
			<TooltipContent>{tooltipText}</TooltipContent>
		</Tooltip>
	</TooltipProvider>
);

export { ActionButton, ActionButtonWithTooltip };
