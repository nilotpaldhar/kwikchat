"use client";

import InfiniteScroll from "@/components/infinite-scroll";

import PageTitle from "@/app/messenger/(routes)/friends/_components/page-title";
import ErrorAlert from "@/app/messenger/(routes)/friends/_components/error-alert";
import FriendTile from "@/app/messenger/(routes)/friends/_components/friend-tile";
import { List, ListSkeleton } from "@/app/messenger/(routes)/friends/_components/list";

import { cn } from "@/utils/general/cn";
import { useFriendsQuery } from "@/hooks/tanstack-query/use-friend";

interface FriendDirectoryProps {
	searchQuery?: string;
	isOnline?: boolean;
	pageTitlePrefix?: string;
}

const FriendDirectory = ({
	searchQuery = "",
	isOnline = false,
	pageTitlePrefix = "Friends",
}: FriendDirectoryProps) => {
	const { data, isSuccess, isLoading, isError, error, refetch, fetchNextPage, isFetchingNextPage } =
		useFriendsQuery({ searchQuery, isOnline });
	const totalFriends = data?.pages[0].data?.pagination.totalItems ?? 0;

	return (
		<div>
			<PageTitle>
				{pageTitlePrefix} - {totalFriends}
			</PageTitle>
			{isLoading && <ListSkeleton />}
			{!isLoading && isError && <ErrorAlert onClick={() => refetch()}>{error.message}</ErrorAlert>}
			{!isLoading && isSuccess && data?.pages && (
				<InfiniteScroll next={fetchNextPage} loading={isFetchingNextPage}>
					<div className={cn("flex flex-col space-y-3 pb-2")}>
						{data.pages.map((page) =>
							page.data?.items ? (
								<List key={page.data?.pagination.page}>
									{page.data?.items.map((friend) => (
										<li key={friend.id}>
											<FriendTile {...friend} />
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

export default FriendDirectory;
