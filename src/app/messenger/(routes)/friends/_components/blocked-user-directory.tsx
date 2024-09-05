"use client";

import InfiniteScroll from "@/components/infinite-scroll";

import PageTitle from "@/app/messenger/(routes)/friends/_components/page-title";
import ErrorAlert from "@/app/messenger/(routes)/friends/_components/error-alert";
import BlockUserTile from "@/app/messenger/(routes)/friends/_components/block-user-tile";
import { List, ListSkeleton } from "@/app/messenger/(routes)/friends/_components/list";

import { cn } from "@/utils/general/cn";
import { useBlockedUsersQuery } from "@/hooks/tanstack-query/use-block";

const BlockedUserDirectory = ({ searchQuery = "" }: { searchQuery?: string }) => {
	const { data, isSuccess, isLoading, isError, error, refetch, fetchNextPage, isFetchingNextPage } =
		useBlockedUsersQuery(searchQuery);
	const totalBlockedUsers = data?.pages[0].data?.pagination.totalItems ?? 0;

	return (
		<div>
			<PageTitle>Blocked - {totalBlockedUsers}</PageTitle>
			{isLoading && <ListSkeleton />}
			{!isLoading && isError && <ErrorAlert onClick={() => refetch()}>{error.message}</ErrorAlert>}
			{!isLoading && isSuccess && data?.pages && (
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
			)}
		</div>
	);
};
export default BlockedUserDirectory;
