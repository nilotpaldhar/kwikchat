"use client";

import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

import { cn } from "@/utils/general/cn";

interface ActionMenuProps {
	id: string;
	popoverId: string;
	isGroupConversation: boolean;
	isGroupCreator: boolean;
	side?: "bottom" | "top" | "right" | "left";
	sideOffset?: number;
	align?: "end" | "center" | "start";
	alignOffset?: number;
	className?: number;
	onGroupExit?: () => void;
	onGroupDelete?: () => void;
	onDeleteConversation?: () => void;
	onBlock?: () => void;
}

const ActionMenu = ({
	id,
	popoverId,
	isGroupConversation,
	isGroupCreator,
	side = "bottom",
	sideOffset = 2,
	align = "start",
	alignOffset = -8,
	className,
	onGroupExit = () => {},
	onGroupDelete = () => {},
	onDeleteConversation = () => {},
	onBlock = () => {},
}: ActionMenuProps) => {
	const btnClassNames =
		"w-full justify-start space-x-2 border-transparent bg-transparent px-1.5 text-left hover:bg-surface-light-300 dark:border-transparent dark:hover:bg-surface-dark-500";

	return (
		<div id={id} className={cn("flex items-center justify-end", className)}>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						className="h-5 w-5 rounded-full border-none bg-transparent p-0 text-neutral-500 hover:bg-transparent focus-visible:ring-offset-0 dark:bg-transparent dark:text-neutral-400 dark:hover:bg-transparent"
					>
						<ChevronDown size={16} />
					</Button>
				</PopoverTrigger>
				<PopoverContent
					id={popoverId}
					side={side}
					sideOffset={sideOffset}
					align={align}
					alignOffset={alignOffset}
					className="flex max-w-40 flex-col space-y-1 p-1.5"
				>
					{isGroupConversation && (
						<Button
							variant="outline"
							className={btnClassNames}
							onClick={() => (isGroupCreator ? onGroupDelete() : onGroupExit())}
						>
							<span className="font-semibold">
								{isGroupCreator ? "Delete Group" : "Exit Group"}
							</span>
						</Button>
					)}

					{!isGroupConversation && (
						<Button variant="outline" className={btnClassNames} onClick={() => onBlock()}>
							<span className="font-semibold">Block</span>
						</Button>
					)}

					<Button
						variant="outline"
						className={btnClassNames}
						onClick={() => onDeleteConversation()}
					>
						<span className="font-semibold">Delete Chat</span>
					</Button>
				</PopoverContent>
			</Popover>
		</div>
	);
};

export default ActionMenu;
