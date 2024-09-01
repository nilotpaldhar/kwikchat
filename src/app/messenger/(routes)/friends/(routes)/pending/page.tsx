"use client";

import { useFriendRequestsQuery } from "@/hooks/use-friend-request";

import { XOctagon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Block, BlockTitle } from "@/components/ui/block";
import { Alert, AlertTitle } from "@/components/ui/alert";
import InfiniteScroll from "@/components/infinite-scroll";

import {
	FriendRequestList,
	FriendRequestListSkeleton,
} from "@/app/messenger/(routes)/friends/_components/friend-request-list";
import { cn } from "@/utils/general/cn";

const FriendsPendingPage = () => {
	const {
		data,
		isError,
		isLoading,
		isFetching,
		error,
		refetch,
		fetchNextPage,
		isFetchingNextPage,
	} = useFriendRequestsQuery();
	const totalPendingRequests = data?.pages[0].data?.pagination.totalItems ?? 0;

	if (isLoading) return <FriendRequestListSkeleton />;

	if (isError)
		return (
			<Alert variant="danger" closable={false}>
				<XOctagon />
				<AlertTitle>
					<span>{error.message}</span>
					<Button
						variant="link"
						onClick={() => refetch()}
						className="ml-1 h-auto p-0 font-semibold text-red-600 underline"
					>
						Retry
					</Button>
				</AlertTitle>
			</Alert>
		);

	return (
		<div>
			<Block>
				<BlockTitle className="border-b border-neutral-200 pb-4 text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
					Pending - {totalPendingRequests}
				</BlockTitle>
			</Block>
			<InfiniteScroll next={fetchNextPage} loading={isFetchingNextPage}>
				<div
					className={cn(
						"py-2 transition",
						isFetching && !isFetchingNextPage && "pointer-events-none opacity-50"
					)}
				>
					{data?.pages.map((page) =>
						page.data?.items ? (
							<FriendRequestList key={page.data?.pagination.page} collection={page.data?.items} />
						) : null
					)}
				</div>
			</InfiniteScroll>
		</div>
	);
};

export default FriendsPendingPage;
