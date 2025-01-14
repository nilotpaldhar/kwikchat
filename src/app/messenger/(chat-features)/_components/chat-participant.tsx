"use client";

import { Button } from "@/components/ui/button";
import Skeleton from "@/components/ui/skeleton";
import UserAvatar from "@/components/user/user-avatar";

import useChatInfoStore from "@/store/use-chat-info-store";
import { useParticipantInConversationQuery } from "@/hooks/tanstack-query/use-conversation";

import { cn } from "@/utils/general/cn";
import formatDateBasedOnRecency from "@/utils/general/format-date-based-on-recency";

interface ChatParticipantProps {
	conversationId: string;
}

const LoadingSkeleton = () => (
	<div className="flex items-center space-x-2">
		<Skeleton className="size-12 rounded-full" />
		<div className="flex flex-col space-y-1.5">
			<Skeleton className="h-3 w-[80px] rounded sm:w-[120px]" />
			<Skeleton className="h-3 w-[60px] rounded sm:w-[80px]" />
		</div>
	</div>
);

const ChatParticipant = ({ conversationId }: ChatParticipantProps) => {
	const toggleContactInfo = useChatInfoStore().toggleOpen;
	const { data, isLoading, isError } = useParticipantInConversationQuery(conversationId);
	const participant = data?.data;

	if (isLoading) return <LoadingSkeleton />;

	if (isError || !participant || !participant.username) return <LoadingSkeleton />;

	const { name, username, avatar, displayName, isOnline, lastSeen } = participant;
	const fallback = name ? name.charAt(0) : username.charAt(0);

	return (
		<Button
			variant="outline"
			onClick={() => toggleContactInfo("USER_INFO")}
			className="flex items-center justify-start space-x-2 border-none bg-transparent p-0 text-left hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent"
		>
			<UserAvatar src={avatar} fallback={fallback.toUpperCase()} />
			<div className="flex flex-col space-y-1.5">
				<div className="max-w-48 truncate text-base font-semibold leading-4">{displayName}</div>
				<div
					className={cn(
						"text-xs font-medium lowercase leading-none text-neutral-500 dark:text-neutral-400",
						isOnline && "text-green-600 dark:text-green-600"
					)}
				>
					{isOnline && "online"}
					{!isOnline && !lastSeen && "offline"}
					{!isOnline && lastSeen && `last seen at ${formatDateBasedOnRecency(lastSeen)}`}
				</div>
			</div>
		</Button>
	);
};

export default ChatParticipant;
