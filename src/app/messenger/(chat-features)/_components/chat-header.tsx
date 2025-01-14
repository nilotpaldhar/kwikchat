"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import GroupInfo from "@/app/messenger/(chat-features)/_components/group-info";
import ChatParticipant from "@/app/messenger/(chat-features)/_components/chat-participant";
import {
	PrivateChatHeaderActions,
	GroupChatHeaderActions,
} from "@/app/messenger/(chat-features)/_components/chat-header-actions";

const ChatContactInfo = dynamic(
	() => import("@/app/messenger/(chat-features)/_components/chat-contact-info")
);
const GroupChatDetails = dynamic(
	() => import("@/app/messenger/(chat-features)/_components/group-chat-details")
);

interface ChatHeaderProps {
	conversationId: string;
	conversationType: "private" | "group";
}

const ChatHeader = ({ conversationId, conversationType }: ChatHeaderProps) => (
	<>
		<header className="flex h-full items-center justify-between">
			<div className="flex items-center">
				<Button
					variant="outline"
					size="icon"
					className="mr-2 size-6 border-transparent p-0 text-neutral-700 hover:bg-transparent dark:border-transparent dark:text-neutral-300 dark:hover:bg-transparent md:hidden"
					asChild
				>
					<Link href="/messenger">
						<ArrowLeft size={20} />
						<span className="sr-only">Go Back</span>
					</Link>
				</Button>
				{conversationType === "private" ? (
					<ChatParticipant conversationId={conversationId} />
				) : (
					<GroupInfo conversationId={conversationId} />
				)}
			</div>

			{conversationType === "private" ? (
				<PrivateChatHeaderActions conversationId={conversationId} />
			) : (
				<GroupChatHeaderActions conversationId={conversationId} />
			)}
		</header>
		{conversationType === "private" ? (
			<ChatContactInfo conversationId={conversationId} />
		) : (
			<GroupChatDetails conversationId={conversationId} />
		)}
	</>
);

export default ChatHeader;
