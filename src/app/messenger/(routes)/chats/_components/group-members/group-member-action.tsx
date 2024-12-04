"use client";

import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { cn } from "@/utils/general/cn";

interface GroupMemberActionProps {
	icon: LucideIcon;
	srText?: string;
	className?: string;
	tooltipText?: string;
	onClick?: () => void;
}

const GroupMemberAction = ({
	icon: Icon,
	tooltipText,
	srText,
	onClick = () => {},
	className,
}: GroupMemberActionProps) => {
	const btnClaasName =
		"size-7 rounded-full border-transparent bg-neutral-100 hover:bg-neutral-200 dark:border-transparent dark:bg-neutral-900 dark:hover:bg-neutral-800";

	return (
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
				<TooltipContent className="px-2 py-1 text-xs">{tooltipText}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default GroupMemberAction;
