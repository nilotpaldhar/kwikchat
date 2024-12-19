"use client";

import { UserX, SearchX } from "lucide-react";

import InfiniteScroll from "@/components/infinite-scroll";
import { Empty, EmptyIcon, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

import ErrorAlert from "@/app/messenger/_components/error-alert";

import PageTitle from "@/app/messenger/(friends-management)/_components/page-title";
import { List, ListSkeleton } from "@/app/messenger/(friends-management)/_components/list";
import BlockUserTile from "@/app/messenger/(friends-management)/_components/block-user-tile";

import { cn } from "@/utils/general/cn";
import { useBlockedUsersQuery } from "@/hooks/tanstack-query/use-block";

const BlockedUserDirectory = ({ searchQuery = "" }: { searchQuery?: string }) => {
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
	} = useBlockedUsersQuery(searchQuery);
	const totalBlockedUsers = data?.pages[0].data?.pagination.totalItems ?? 0;
	const isEmpty = isSuccess && (data?.pages[0].data?.items.length ?? 0) <= 0;

	return (
		<div>
			<PageTitle isLoading={isFetching}>Blocked - {totalBlockedUsers}</PageTitle>
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
											{page.data?.items.map((blockedUser) => (
												<li key={blockedUser.user.id}>
													<BlockUserTile {...blockedUser} />
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
									{searchQuery && <span>No Blocked Users Found</span>}
									{!searchQuery && <span>No Blocked Users</span>}
								</EmptyTitle>
								<EmptyDescription>
									{searchQuery && (
										<span>
											We couldn&apos;t find any blocked users matching your search. Try adjusting
											your search criteria or review your block list.
										</span>
									)}
									{!searchQuery && (
										<span>
											You haven&apos;t blocked anyone yet. If needed, you can block users to manage
											your connections.
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
export default BlockedUserDirectory;
