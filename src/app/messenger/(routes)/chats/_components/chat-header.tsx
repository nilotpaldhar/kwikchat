"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import ChatParticipant from "@/app/messenger/(routes)/chats/_components/chat-participant";
import ChatHeaderActions from "@/app/messenger/(routes)/chats/_components/chat-header-actions";

import { useParticipantInConversationQuery } from "@/hooks/tanstack-query/use-conversation";

const ChatContactInfo = dynamic(
	() => import("@/app/messenger/(routes)/chats/_components/chat-contact-info")
);

interface ChatHeaderProps {
	conversationId: string;
	conversationType: "private" | "group";
}

const ChatHeader = ({ conversationId, conversationType }: ChatHeaderProps) => {
	const { data, isLoading, isError, error, refetch } =
		useParticipantInConversationQuery(conversationId);

	return (
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
						<ChatParticipant participant={data?.data} isLoading={isLoading} isError={isError} />
					) : (
						<div>Group Chat</div>
					)}
				</div>
				<ChatHeaderActions />
			</header>
			<ChatContactInfo
				participant={data?.data}
				isLoading={isLoading}
				isError={isError}
				error={error}
				refetch={refetch}
			/>
		</>
	);
};

export default ChatHeader;
