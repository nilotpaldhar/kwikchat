"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
	SidePanel,
	SidePanelHeader,
	SidePanelContent,
} from "@/app/messenger/_components/side-panel";

import StarredMessageDirectory from "@/app/messenger/(chat-features)/_components/starred-message-directory";

interface StarredMessagesPanelProps {
	conversationId: string;
	onBack: () => void;
}

const StarredMessagesPanel = ({ conversationId, onBack }: StarredMessagesPanelProps) => (
	<SidePanel>
		<SidePanelHeader>
			<div className="flex w-full items-center space-x-3">
				<Button
					variant="outline"
					size="icon"
					className="size-5 border-transparent bg-transparent p-0 text-neutral-700 hover:bg-transparent dark:border-transparent dark:bg-transparent dark:text-neutral-300 dark:hover:bg-transparent"
					onClick={onBack}
				>
					<ArrowLeft size={20} />
					<span className="sr-only">Close</span>
				</Button>
				<h1 className="text-base font-semibold leading-none">Starred Messages</h1>
			</div>
		</SidePanelHeader>
		<SidePanelContent className="h-full p-0">
			<StarredMessageDirectory conversationId={conversationId} />
		</SidePanelContent>
	</SidePanel>
);

export default StarredMessagesPanel;
