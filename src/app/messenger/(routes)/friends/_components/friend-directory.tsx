"use client";

import Link from "next/link";
import { UserX, SearchX } from "lucide-react";

import InfiniteScroll from "@/components/infinite-scroll";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyIcon,
	EmptyTitle,
	EmptyDescription,
	EmptyContent,
} from "@/components/ui/empty";

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
	} = useFriendsQuery({ searchQuery, isOnline });
	const totalFriends = data?.pages[0].data?.pagination.totalItems ?? 0;
	const isEmpty = isSuccess && (data?.pages[0].data?.items.length ?? 0) <= 0;

	return (
		<div>
			<PageTitle isLoading={isFetching}>
				{pageTitlePrefix} - {totalFriends}
			</PageTitle>
			{isLoading && <ListSkeleton />}
			{!isLoading && isError && <ErrorAlert onClick={() => refetch()}>{error.message}</ErrorAlert>}
			{!isLoading && isSuccess && data?.pages && (
				<div>
					{!isEmpty ? (
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
					) : (
						<div className="pt-24">
							<Empty>
								<EmptyIcon icon={!searchQuery ? UserX : SearchX} />
								<EmptyTitle>
									{searchQuery && <span>No Friends Found</span>}
									{!searchQuery && isOnline && <span>No Friends Online</span>}
									{!searchQuery && !isOnline && <span>You haven&apos;t made any friends yet!</span>}
								</EmptyTitle>
								<EmptyDescription>
									{searchQuery && (
										<span>
											Sorry, we couldn&apos;t find any friends matching your search. Try adjusting
											your seach or explore other ways to connect!
										</span>
									)}
									{!searchQuery && isOnline && (
										<span>
											None of your friends are currently online. Check back later or send them a
											message to reconnect!
										</span>
									)}
									{!searchQuery && !isOnline && (
										<span>
											Start connecting with others by sending friend requests. Once they accept,
											you&apos;ll see your friends here!
										</span>
									)}
								</EmptyDescription>
								{!searchQuery && !isOnline && (
									<EmptyContent>
										<Button>
											<Link href="/messenger/friends/new">Add Friend</Link>
										</Button>
									</EmptyContent>
								)}
							</Empty>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default FriendDirectory;
