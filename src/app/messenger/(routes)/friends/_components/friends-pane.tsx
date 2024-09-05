"use client";

import { useState } from "react";

import type { FriendsFilterType } from "@/types";

import { Button } from "@/components/ui/button";
import Skeleton from "@/components/ui/skeleton";
import InfiniteScroll from "@/components/infinite-scroll";

import ErrorAlert from "@/app/messenger/(routes)/friends/_components/error-alert";
import FriendTile from "@/app/messenger/(routes)/friends/_components/friend-tile";
import { List, ListSkeleton } from "@/app/messenger/(routes)/friends/_components/list";

import { cn } from "@/utils/general/cn";
import { useFilteredFriends } from "@/hooks/tanstack-query/use-friend";

const FriendsPane = () => {
	const filters: FriendsFilterType[] = ["all", "online", "new"];
	const [activeFilter, setActiveFilter] = useState<FriendsFilterType>("all");

	const { data, isSuccess, isLoading, isError, error, refetch, fetchNextPage, isFetchingNextPage } =
		useFilteredFriends({ filter: activeFilter });

	return (
		<div>
			{isLoading && (
				<div className="flex flex-col space-y-4">
					<div className="flex items-center space-x-2 px-5">
						<Skeleton className="h-10 w-16 rounded-md" />
						<Skeleton className="h-10 w-16 rounded-md" />
						<Skeleton className="h-10 w-16 rounded-md" />
					</div>
					<ListSkeleton className="px-5" />
				</div>
			)}
			{!isLoading && isError && <ErrorAlert onClick={() => refetch()}>{error.message}</ErrorAlert>}
			{!isLoading && isSuccess && data?.pages && (
				<div className="flex flex-col space-y-4">
					<div className="flex items-center space-x-2 px-5">
						{filters.map((filter) => {
							const isActive = filter === activeFilter;
							return (
								<Button
									key={filter}
									variant={isActive ? "primary" : "outline"}
									onClick={() => setActiveFilter(filter)}
									className={cn("border", isActive && "border-transparent")}
								>
									<span className="inline-block capitalize">{filter}</span>
								</Button>
							);
						})}
					</div>
					<InfiniteScroll next={fetchNextPage} loading={isFetchingNextPage}>
						<div className={cn("flex flex-col space-y-3 py-2")}>
							{data.pages.map((page) =>
								page.data?.items ? (
									<List key={page.data?.pagination.page}>
										{page.data?.items.map((friend) => (
											<li key={friend.id}>
												<FriendTile {...friend} className="rounded-none px-5" />
											</li>
										))}
									</List>
								) : null
							)}
						</div>
					</InfiniteScroll>
				</div>
			)}
		</div>
	);
};

export default FriendsPane;
