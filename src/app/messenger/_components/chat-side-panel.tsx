"use client";

import { MoreVertical } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
	SidePanel,
	SidePanelHeader,
	SidePanelContent,
} from "@/app/messenger/_components/side-panel";
import StartChatPopover from "@/app/messenger/_components/start-chat-popover";
import OnlineFriendsList from "@/app/messenger/_components/online-friends-list";

const ChatSidePanel = () => (
	<SidePanel>
		<SidePanelHeader>
			<div className="flex w-full items-center justify-between space-x-3">
				<h1 className="heading-3">Chats</h1>
				<StartChatPopover side="bottom" sideOffset={0} align="end" alignOffset={0}>
					<Button
						size="icon"
						variant="outline"
						className="border-none bg-transparent hover:bg-transparent dark:bg-transparent"
					>
						<MoreVertical size={20} />
						<span className="sr-only">Open Chat</span>
					</Button>
				</StartChatPopover>
			</div>
		</SidePanelHeader>
		<SidePanelContent>
			<div className="flex flex-col space-y-10">
				<OnlineFriendsList
					classNames={{
						skeleton: "max-w-52 lg:max-w-xs",
						carousel: "max-w-52 lg:max-w-xs",
					}}
				/>
			</div>
		</SidePanelContent>
	</SidePanel>
);

export default ChatSidePanel;
