"use client";

import { MoreVertical } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
	SidePanel,
	SidePanelHeader,
	SidePanelContent,
} from "@/app/messenger/_components/side-panel";
import StartChatPopover from "@/app/messenger/(chat-features)/_components/start-chat-popover";
import ConversationsList from "@/app/messenger/(chat-features)/_components/conversations-list";
import OnlineFriendsList from "@/app/messenger/(chat-features)/_components/online-friends-list";

const ChatSidePanel = () => (
	<SidePanel>
		<SidePanelHeader>
			<div className="flex w-full items-center justify-between space-x-3">
				<h1 className="heading-3">Chats</h1>
				<StartChatPopover side="bottom" sideOffset={0} align="end" alignOffset={0}>
					<Button
						size="icon"
						variant="outline"
						className="size-5 border-transparent bg-transparent p-0 text-neutral-700 hover:bg-transparent dark:border-transparent dark:bg-transparent dark:text-neutral-300 dark:hover:bg-transparent"
					>
						<MoreVertical size={20} />
						<span className="sr-only">Open Chat</span>
					</Button>
				</StartChatPopover>
			</div>
		</SidePanelHeader>
		<SidePanelContent className="px-0 pb-0">
			<div className="flex flex-col space-y-10">
				<OnlineFriendsList
					className="px-5"
					classNames={{
						skeleton: "max-w-52 lg:max-w-xs",
						carousel: "max-w-52 lg:max-w-xs",
					}}
				/>
				<ConversationsList
					classNames={{
						filter: "px-5",
						skeleton: "px-5",
						errorAlert: "px-5",
						conversationTile: "px-5",
					}}
				/>
			</div>
		</SidePanelContent>
	</SidePanel>
);

export default ChatSidePanel;
