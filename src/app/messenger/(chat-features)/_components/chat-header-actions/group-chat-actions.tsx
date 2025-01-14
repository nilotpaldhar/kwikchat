"use client";

import { Info, MoreVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

import { cn } from "@/utils/general/cn";
import useChatInfoStore from "@/store/use-chat-info-store";
import useMessengerDialogStore from "@/store/use-messenger-dialog-store";

interface GroupChatHeaderActionsProps {
	conversationId: string;
}

const GroupChatHeaderActions = ({ conversationId }: GroupChatHeaderActionsProps) => {
	const toggleContactInfo = useChatInfoStore().toggleOpen;
	const openMessengerDialog = useMessengerDialogStore().onOpen;

	const btnClassNames = `border-transparent text-neutral-700 dark:border-transparent dark:text-neutral-300`;
	const popoverBtnClassNames = `w-full justify-start border-transparent bg-transparent px-2.5 text-left hover:bg-surface-light-300 dark:border-transparent dark:hover:bg-surface-dark-500`;

	return (
		<div className="flex items-center space-x-5">
			<Button
				variant="outline"
				size="icon"
				className={cn(btnClassNames, "hidden md:flex")}
				onClick={() => toggleContactInfo("GROUP_DETAILS")}
			>
				<Info size={20} />
				<span className="sr-only">Group Info</span>
			</Button>
			<Popover>
				<PopoverTrigger asChild>
					<Button variant="outline" size="icon" className={btnClassNames}>
						<MoreVertical size={20} />
						<span className="sr-only">More</span>
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className="max-w-48 p-1.5"
					side="bottom"
					sideOffset={0}
					align="end"
					alignOffset={0}
				>
					<Button
						variant="outline"
						className={cn(popoverBtnClassNames, "md:hidden")}
						onClick={() => toggleContactInfo("GROUP_DETAILS")}
					>
						<span className="font-semibold">Group Info</span>
					</Button>
					<Button
						variant="outline"
						className={popoverBtnClassNames}
						onClick={() =>
							openMessengerDialog("CLEAR_CONVERSATION", {
								conversationToClear: { conversationId },
							})
						}
					>
						<span className="font-semibold">Clear Chat</span>
					</Button>
					<Button
						variant="outline"
						className={popoverBtnClassNames}
						onClick={() =>
							openMessengerDialog("DELETE_CONVERSATION", {
								conversationToDelete: { conversationId },
							})
						}
					>
						<span className="font-semibold">Delete Chat</span>
					</Button>
				</PopoverContent>
			</Popover>
		</div>
	);
};

export default GroupChatHeaderActions;
