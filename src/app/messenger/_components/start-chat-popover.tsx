"use client";

import { MessageSquarePlus, UsersRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

import useMessengerDialogStore from "@/store/use-messenger-dialog-store";

interface StartChatPopoverProps {
	side?: "bottom" | "top" | "right" | "left";
	sideOffset?: number;
	align?: "end" | "center" | "start";
	alignOffset?: number;
	children: React.ReactNode;
}

const StartChatPopover = ({
	side = "top",
	sideOffset = 0,
	align = "center",
	alignOffset = 0,
	children,
}: StartChatPopoverProps) => {
	const onOpen = useMessengerDialogStore().onOpen;

	const btnClassNames =
		"w-full justify-start space-x-2 border-transparent bg-transparent px-1.5 text-left hover:bg-surface-light-300 dark:border-transparent dark:hover:bg-surface-dark-500";

	return (
		<Popover>
			<PopoverTrigger asChild>{children}</PopoverTrigger>
			<PopoverContent
				className="flex max-w-48 flex-col space-y-1 p-1.5"
				side={side}
				sideOffset={sideOffset}
				align={align}
				alignOffset={alignOffset}
			>
				<Button variant="outline" className={btnClassNames} onClick={() => onOpen("NEW_CHAT")}>
					<MessageSquarePlus size={16} />
					<span className="font-semibold">New Chat</span>
				</Button>
				<Button
					variant="outline"
					className={btnClassNames}
					onClick={() => onOpen("NEW_GROUP_CHAT")}
				>
					<UsersRound size={16} />
					<span className="font-semibold">New Group</span>
				</Button>
			</PopoverContent>
		</Popover>
	);
};

export default StartChatPopover;
