"use client";

import InfiniteScroll from "@/components/infinite-scroll";

import PageTitle from "@/app/messenger/(routes)/friends/_components/page-title";
import ErrorAlert from "@/app/messenger/(routes)/friends/_components/error-alert";
import FriendRequestTile from "@/app/messenger/(routes)/friends/_components/friend-request-tile";
import { List, ListSkeleton } from "@/app/messenger/(routes)/friends/_components/list";

import { cn } from "@/utils/general/cn";
import { useFriendRequestsQuery } from "@/hooks/tanstack-query/use-friend-request";

const FriendRequestDirectory = ({ searchQuery = "" }: { searchQuery?: string }) => {
	const { data, isSuccess, isLoading, isError, error, refetch, fetchNextPage, isFetchingNextPage } =
		useFriendRequestsQuery(searchQuery);
	const totalPendingRequests = data?.pages[0].data?.pagination.totalItems ?? 0;

	return (
		<div>
			<PageTitle>Pending - {totalPendingRequests}</PageTitle>
			{isLoading && <ListSkeleton />}
			{!isLoading && isError && <ErrorAlert onClick={() => refetch()}>{error.message}</ErrorAlert>}
			{!isLoading && isSuccess && data?.pages && (
				<InfiniteScroll next={fetchNextPage} loading={isFetchingNextPage}>
					<div className={cn("flex flex-col space-y-3 pb-2")}>
						{data?.pages.map((page) =>
							page.data?.items ? (
								<List key={page.data?.pagination.page}>
									{page.data?.items.map((friendRequest) => (
										<li key={friendRequest.id}>
											<FriendRequestTile key={friendRequest.id} {...friendRequest} />
										</li>
									))}
								</List>
							) : null
						)}
					</div>
				</InfiniteScroll>
			)}
		</div>
	);
};

export default FriendRequestDirectory;
