"use client";

import { Button } from "@/components/ui/button";
import Skeleton from "@/components/ui/skeleton";
import UserAvatar from "@/components/user/user-avatar";

import useChatInfoStore from "@/store/use-chat-info-store";
import { useGroupConversationDetailsQuery } from "@/hooks/tanstack-query/use-conversation";

import { PLACEHOLDER_GROUP_IMAGE } from "@/constants/media";

interface GroupInfoProps {
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

const GroupInfo = ({ conversationId }: GroupInfoProps) => {
	const toggleContactInfo = useChatInfoStore().toggleOpen;

	const { data, isLoading, isError } = useGroupConversationDetailsQuery(conversationId);
	const overview = data?.data;

	if (isLoading) return <LoadingSkeleton />;

	if (isError || !overview) return <LoadingSkeleton />;

	const { name, members, icon } = overview;

	return (
		<Button
			variant="outline"
			onClick={() => toggleContactInfo("GROUP_DETAILS")}
			className="flex items-center justify-start space-x-2 border-none bg-transparent p-0 text-left hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent"
		>
			<UserAvatar src={icon ?? PLACEHOLDER_GROUP_IMAGE} fallback={name.charAt(0).toUpperCase()} />
			<div className="flex flex-col space-y-1.5">
				<div title={name} className="max-w-48 truncate text-base font-semibold leading-4">
					{name}
				</div>
				<div className="flex items-center space-x-2 text-xs font-medium lowercase leading-none">
					<div className="text-neutral-500 dark:text-neutral-400">
						{members.total} {members.total > 1 ? "members" : "member"}
					</div>
					<div role="separator" className="size-1 rounded-full bg-neutral-200" />
					<div className="text-green-600 dark:text-green-600">{members.online} online</div>
				</div>
			</div>
		</Button>
	);
};

export default GroupInfo;
