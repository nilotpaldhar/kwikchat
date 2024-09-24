"use client";

import { format } from "date-fns";

import { cn } from "@/utils/general/cn";
import { usePrivateMessagesQuery } from "@/hooks/tanstack-query/use-message";

interface ChatAreaProps {
	conversationId: string;
	currentUserId: string;
}

const ChatArea = ({ currentUserId, conversationId }: ChatAreaProps) => {
	const { data, isLoading, isError } = usePrivateMessagesQuery({ conversationId });

	if (isLoading) return <div className="">Loading...</div>;
	if (isError) return <div className="">Error...</div>;

	return (
		<ul className="flex flex-col space-y-4">
			{data?.data?.map((message) => {
				const isSendByCurrentUser = currentUserId === message.senderId;

				return (
					<li
						key={message.id}
						className={cn(
							"flex flex-col space-y-2",
							isSendByCurrentUser ? "items-end" : "items-start"
						)}
					>
						<div
							className={cn(
								"max-w-64 rounded-xl px-4 py-3 text-sm leading-6 shadow-md sm:max-w-xs lg:max-w-md xl:max-w-xl 3xl:max-w-3xl",
								isSendByCurrentUser
									? "rounded-tr-none bg-primary-400 text-white"
									: "rounded-tl-none bg-white text-neutral-900"
							)}
						>
							{message.textMessage?.content}
						</div>
						<div className="px-1 text-xs font-semibold lowercase text-neutral-500">
							{format(message.createdAt, "hh:mm a")}
						</div>
					</li>
				);
			})}
		</ul>
	);
};

export default ChatArea;
