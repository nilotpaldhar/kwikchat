"use client";

import Loader from "@/components/ui/loader";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";
import InfiniteScroll from "@/components/infinite-scroll";

import ErrorAlert from "@/app/messenger/_components/error-alert";
import StarredMessageTile from "@/app/messenger/(routes)/chats/_components/starred-message-tile";

import { useStarredMessagesQuery } from "@/hooks/tanstack-query/use-message";

interface StarredMessageDirectoryProps {
	conversationId: string;
}
const StarredMessageDirectory = ({ conversationId }: StarredMessageDirectoryProps) => {
	const { data, isSuccess, isLoading, isError, error, refetch, fetchNextPage, isFetchingNextPage } =
		useStarredMessagesQuery({ conversationId });
	const isEmpty = isSuccess && (data?.pages[0]?.data?.items.length ?? 0) <= 0;

	if (isLoading) {
		return (
			<div className="flex h-[calc(100vh-80px)] w-full items-center justify-center">
				<Loader />
			</div>
		);
	}

	if (isError) {
		return (
			<ErrorAlert onClick={() => refetch()}>
				{error ? error.message : "Something went wrong!"}
			</ErrorAlert>
		);
	}

	return data?.pages ? (
		<div>
			{!isEmpty ? (
				<InfiniteScroll next={fetchNextPage} loading={isFetchingNextPage}>
					<div className="flex flex-col space-y-3 pb-2">
						{data.pages.map((page) =>
							page.data?.items ? (
								<ul
									key={page.data?.pagination.page}
									className="flex flex-col divide-y divide-neutral-200 dark:divide-neutral-800"
								>
									{page.data?.items.map((message) => (
										<li key={message.id}>
											<StarredMessageTile message={message} />
										</li>
									))}
								</ul>
							) : null
						)}
					</div>
				</InfiniteScroll>
			) : (
				<div className="px-5 pt-24">
					<Empty>
						<EmptyTitle>No Starred Messages</EmptyTitle>
						<EmptyDescription>
							You haven&apos;t starred any messages yet. Highlight important messages to find them
							here easily.
						</EmptyDescription>
					</Empty>
				</div>
			)}
		</div>
	) : null;
};

export default StarredMessageDirectory;
