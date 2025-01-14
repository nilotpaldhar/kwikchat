"use client";

import type { ConversationsFilterType } from "@/types";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

import { Inbox } from "lucide-react";

import InfiniteScroll from "@/components/infinite-scroll";
import { Empty, EmptyIcon, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

import ErrorAlert from "@/app/messenger/_components/error-alert";

import ConversationTile from "@/app/messenger/(chat-features)/_components/conversation-tile";
import LoadingSkeleton from "@/app/messenger/(chat-features)/_components/conversations-list/loading-skeleton";
import ConversationsFilter from "@/app/messenger/(chat-features)/_components/conversations-list/conversations-filter";

import useCurrentUser from "@/hooks/tanstack-query/use-current-user";
import { useConversationWithMetadataQuery } from "@/hooks/tanstack-query/use-conversation";

interface ConversationsListProps {
	className?: string;
	classNames?: {
		filter?: string;
		skeleton?: string;
		errorAlert?: string;
		conversationTile?: string;
	};
}

const ConversationsList = ({ className, classNames }: ConversationsListProps) => {
	const router = useRouter();
	const params = useParams();

	const [activeFilter, setActiveFilter] = useState<ConversationsFilterType>("all");

	const { data: { data: currentUser } = {} } = useCurrentUser();
	const {
		data,
		isLoading,
		isSuccess,
		isError,
		isFetching,
		isFetchingNextPage,
		error,
		refetch,
		fetchNextPage,
	} = useConversationWithMetadataQuery({
		filter: activeFilter,
	});

	const isEmpty = isSuccess && (data?.pages[0].data?.items.length ?? 0) <= 0;
	const isEmptyAll = isEmpty && activeFilter === "all";
	const isEmptyGroup = isEmpty && activeFilter === "group";
	const isEmptyUnread = isEmpty && activeFilter === "unread";

	return (
		<div className={className}>
			{!isEmptyAll && (
				<ConversationsFilter
					disabled={isFetching}
					className={classNames?.filter}
					onChange={(filter) => setActiveFilter(filter)}
				/>
			)}
			{isLoading && <LoadingSkeleton className={classNames?.skeleton} />}
			{!isLoading && isError && (
				<div className={classNames?.errorAlert}>
					<ErrorAlert onClick={() => refetch()}>{error.message}</ErrorAlert>
				</div>
			)}
			{!isLoading && isSuccess && data?.pages && (
				<div>
					{!isEmpty ? (
						<InfiniteScroll next={fetchNextPage} loading={isFetchingNextPage}>
							<div className="flex flex-col space-y-2 pb-4">
								{data.pages.map((page) =>
									page.data?.items ? (
										<ul key={page.data?.pagination.page} className="flex flex-col space-y-2">
											{page.data?.items.map((conversation) => (
												<li key={conversation.id}>
													<ConversationTile
														{...conversation}
														currentUserId={currentUser?.id}
														isActive={params?.id === conversation.id}
														className={classNames?.conversationTile}
														onNavigate={() => router.push(`/messenger/chats/${conversation.id}`)}
													/>
												</li>
											))}
										</ul>
									) : null
								)}
							</div>
						</InfiniteScroll>
					) : (
						<div className="px-5 pt-20">
							<Empty>
								<EmptyIcon icon={Inbox} size={64} />
								<EmptyTitle className="text-base">
									{isEmptyAll && <span>Start a Conversation</span>}
									{isEmptyGroup && <span>No Group Chats Available</span>}
									{isEmptyUnread && <span>All Caught Up!</span>}
								</EmptyTitle>
								<EmptyDescription className="text-xs leading-5">
									{isEmptyAll && (
										<span>
											You don&apos;t have any active chats. Start a conversation by reaching out to
											someone!
										</span>
									)}
									{isEmptyGroup && (
										<span>
											It seems like you&apos;re not part of any group chats yet. Create a group to
											connect with others or join an existing one to collaborate and share!
										</span>
									)}
									{isEmptyUnread && (
										<span>
											You&apos;re all caught up! No new messages at the moment. Stay tuned for
											updates or start a new chat to keep the conversation going.
										</span>
									)}
								</EmptyDescription>
							</Empty>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default ConversationsList;
