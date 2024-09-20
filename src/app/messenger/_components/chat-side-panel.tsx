"use client";

import { MoreVertical, MessageSquarePlus, UsersRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

import {
	SidePanel,
	SidePanelHeader,
	SidePanelContent,
} from "@/app/messenger/_components/side-panel";

import useMessengerDialogStore from "@/store/use-messenger-dialog-store";

const ChatSidePanel = () => {
	const onOpen = useMessengerDialogStore().onOpen;

	return (
		<SidePanel>
			<SidePanelHeader>
				<div className="flex w-full items-center justify-between space-x-3">
					<h1 className="heading-3">Chats</h1>
					<Popover>
						<PopoverTrigger asChild>
							<Button
								size="icon"
								variant="outline"
								className="border-none bg-transparent hover:bg-transparent dark:bg-transparent"
							>
								<MoreVertical size={20} />
								<span className="sr-only">Open Chat</span>
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
								className="w-full justify-start space-x-2 border-transparent bg-transparent px-1.5 text-left hover:bg-surface-light-300 dark:border-transparent dark:hover:bg-surface-dark-500"
								onClick={() => onOpen("NEW_CHAT")}
							>
								<MessageSquarePlus size={16} />
								<span className="font-semibold">New Chat</span>
							</Button>
							<Button
								variant="outline"
								className="w-full justify-start space-x-2 border-transparent bg-transparent px-1 text-left hover:bg-surface-light-300 dark:border-transparent dark:hover:bg-surface-dark-500"
								onClick={() => onOpen("NEW_GROUP_CHAT")}
							>
								<UsersRound size={16} />
								<span className="font-semibold">New Group</span>
							</Button>
						</PopoverContent>
					</Popover>
				</div>
			</SidePanelHeader>
			<SidePanelContent className="px-5">Recent Chats</SidePanelContent>
		</SidePanel>
	);
};

export default ChatSidePanel;
