"use client";

import type { InfiniteData } from "@tanstack/react-query";
import type { APIResponse, CompleteMessage, PaginatedResponse } from "@/types";

import { ElementRef, useMemo, useRef } from "react";

import { Inbox } from "lucide-react";

import ChatAreaSkeleton from "@/components/skeletons/chat-area-skeleton";
import { Empty, EmptyIcon, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

import ErrorAlert from "@/app/messenger/_components/error-alert";

import ChatAreaLoader from "@/app/messenger/(chat-features)/_components/chat-area/loader";
import ChatMessageDateGroup from "@/app/messenger/(chat-features)/_components/chat-message-date-group";

import groupMessagesByDate from "@/utils/messenger/group-messages-by-date";

import useChatAreaScroll from "@/hooks/use-chat-area-scroll";
import { useMessagesQuery } from "@/hooks/tanstack-query/use-message";

interface ChatAreaProps {
	conversationId: string;
	isGroupConversation: boolean;
	currentUserId: string;
}

const combineMessages = (data?: InfiniteData<APIResponse<PaginatedResponse<CompleteMessage>>>) => {
	if (!data) return [];

	const messages: CompleteMessage[] = [];
	data.pages.forEach((page) => {
		page.data?.items.forEach((message) => messages.push(message));
	});

	return messages;
};

const ChatArea = ({ conversationId, currentUserId, isGroupConversation }: ChatAreaProps) => {
	const chatAreaRef = useRef<ElementRef<"div">>(null);
	const chatAreaEndRef = useRef<ElementRef<"div">>(null);

	const {
		data,
		isSuccess,
		isLoading,
		isError,
		error,
		refetch,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
	} = useMessagesQuery({
		conversationId,
		isGroup: isGroupConversation,
	});

	const totalMessages = data?.pages[0]?.data?.pagination.totalItems ?? 0;
	const isEmpty = isSuccess && totalMessages <= 0;

	const combinedMessages = useMemo(() => combineMessages(data), [data]);
	const groupedMessages = useMemo(() => groupMessagesByDate(combinedMessages), [combinedMessages]);

	useChatAreaScroll({
		chatAreaRef,
		chatAreaEndRef,
		count: totalMessages,
		shouldLoadMore: !isFetchingNextPage && hasNextPage,
		loadMore: fetchNextPage,
	});

	return (
		<div ref={chatAreaRef} className="h-screen overflow-y-auto scrollbar-none">
			<div className="mb-20 mt-16 bg-transparent p-5 dark:bg-transparent">
				{isLoading && <ChatAreaSkeleton />}
				{!isLoading && isError && (
					<ErrorAlert onClick={() => refetch()}>{error.message}</ErrorAlert>
				)}
				{!isLoading && isSuccess && data?.pages && (
					<>
						<div>
							{!isEmpty ? (
								<>
									<ChatAreaLoader isFetchingNextPage={isFetchingNextPage && hasNextPage} />
									<div className="flex flex-col-reverse gap-y-14">
										{groupedMessages.map(({ date, messages }) => (
											<ChatMessageDateGroup
												key={date}
												date={date}
												conversationId={conversationId}
												currentUserId={currentUserId}
												messages={messages}
											/>
										))}
									</div>
								</>
							) : (
								<div className="pt-20 lg:pt-32 xl:pt-40">
									<Empty>
										<EmptyIcon icon={Inbox} size={64} />
										<EmptyTitle>It&apos;s Quiet Here... For Now</EmptyTitle>
										<EmptyDescription className="max-w-md">
											Be the first to break the silence—send a message and start the conversation!
										</EmptyDescription>
									</Empty>
								</div>
							)}
						</div>
						<div ref={chatAreaEndRef} />
					</>
				)}
			</div>
		</div>
	);
};

export default ChatArea;
