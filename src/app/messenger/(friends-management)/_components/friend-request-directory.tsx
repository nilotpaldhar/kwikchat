"use client";

import { UserX, SearchX } from "lucide-react";

import InfiniteScroll from "@/components/infinite-scroll";
import { Empty, EmptyIcon, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

import ErrorAlert from "@/app/messenger/_components/error-alert";

import PageTitle from "@/app/messenger/(friends-management)/_components/page-title";
import { List, ListSkeleton } from "@/app/messenger/(friends-management)/_components/list";
import FriendRequestTile from "@/app/messenger/(friends-management)/_components/friend-request-tile";

import { cn } from "@/utils/general/cn";
import { useFriendRequestsQuery } from "@/hooks/tanstack-query/use-friend-request";

const FriendRequestDirectory = ({ searchQuery = "" }: { searchQuery?: string }) => {
	const {
		data,
		isSuccess,
		isLoading,
		isFetching,
		isError,
		error,
		refetch,
		fetchNextPage,
		isFetchingNextPage,
	} = useFriendRequestsQuery(searchQuery);
	const totalPendingRequests = data?.pages[0].data?.pagination.totalItems ?? 0;
	const isEmpty = isSuccess && (data?.pages[0].data?.items.length ?? 0) <= 0;

	return (
		<div>
			<PageTitle isLoading={isFetching}>Pending - {totalPendingRequests}</PageTitle>
			{isLoading && <ListSkeleton />}
			{!isLoading && isError && <ErrorAlert onClick={() => refetch()}>{error.message}</ErrorAlert>}
			{!isLoading && isSuccess && data?.pages && (
				<div>
					{!isEmpty ? (
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
					) : (
						<div className="pt-24">
							<Empty>
								<EmptyIcon icon={!searchQuery ? UserX : SearchX} />
								<EmptyTitle>
									{searchQuery && <span>No Friend Requests Found</span>}
									{!searchQuery && <span>No Friend Requests</span>}
								</EmptyTitle>
								<EmptyDescription>
									{searchQuery && (
										<span>
											Sorry, we couldn&apos;t find any friend requests matching your search. Try
											refining your search or sending a new request!
										</span>
									)}
									{!searchQuery && (
										<span>
											You don&apos;t have any outgoing or incoming friend requests at the moment.
											Start connecting by sending a new request!
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

export default FriendRequestDirectory;
