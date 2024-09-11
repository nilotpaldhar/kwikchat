"use client";

import Link from "next/link";
import { UserX } from "lucide-react";

import { useState } from "react";

import type { FriendsFilterType } from "@/types";

import { Button } from "@/components/ui/button";
import UIBlocker from "@/components/ui/ui-blocker";
import InfiniteScroll from "@/components/infinite-scroll";
import {
	Empty,
	EmptyIcon,
	EmptyTitle,
	EmptyDescription,
	EmptyContent,
} from "@/components/ui/empty";

import ErrorAlert from "@/app/messenger/(routes)/friends/_components/error-alert";
import FriendTile from "@/app/messenger/(routes)/friends/_components/friend-tile";
import { List, ListSkeleton } from "@/app/messenger/(routes)/friends/_components/list";

import { cn } from "@/utils/general/cn";
import { useFilteredFriends } from "@/hooks/tanstack-query/use-friend";

const FriendsPane = () => {
	const filters: FriendsFilterType[] = ["all", "online", "new"];
	const [activeFilter, setActiveFilter] = useState<FriendsFilterType>("all");

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
	} = useFilteredFriends({ filter: activeFilter });

	const isEmpty = isSuccess && (data?.pages[0].data?.items.length ?? 0) <= 0;
	const isEmptyAll = isEmpty && activeFilter === "all";
	const isEmptyOnline = isEmpty && activeFilter === "online";
	const isEmptyNew = isEmpty && activeFilter === "new";

	return (
		<div>
			{!isEmptyAll && (
				<div className="mb-4 flex items-center space-x-2 px-5">
					{filters.map((filter) => {
						const isActive = filter === activeFilter;
						return (
							<Button
								key={filter}
								variant={isActive ? "primary" : "outline"}
								onClick={() => setActiveFilter(filter)}
								className={cn("border", isActive && "border-transparent")}
								disabled={isFetching}
							>
								<span className="inline-block capitalize">{filter}</span>
							</Button>
						);
					})}
				</div>
			)}
			{isLoading && <ListSkeleton className="px-5" />}
			{!isLoading && isError && <ErrorAlert onClick={() => refetch()}>{error.message}</ErrorAlert>}
			{!isLoading && isSuccess && data?.pages && (
				<div className="relative">
					{!isEmpty ? (
						<>
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
							<UIBlocker
								isBlocking={!isLoading && isFetching}
								spinnerClassName="text-neutral-500 dark:text-neutral-400"
							/>
						</>
					) : (
						<div className="px-5 pt-20">
							<Empty>
								<EmptyIcon icon={UserX} size={64} />
								<EmptyTitle className="text-base">
									{isEmptyAll && <span>You haven&apos;t made any friends yet!</span>}
									{isEmptyOnline && <span>No Friends Online</span>}
									{isEmptyNew && <span>No New Friends</span>}
								</EmptyTitle>
								<EmptyDescription className="text-xs leading-5">
									{isEmptyAll && (
										<span>
											Start connecting with others by sending friend requests. Once they accept,
											you&apos;ll see your friends here!
										</span>
									)}
									{isEmptyOnline && (
										<span>
											None of your friends are currently online. Check back later or send them a
											message to reconnect!
										</span>
									)}
									{isEmptyNew && (
										<span>
											You haven&apos;t made any new friends recently. Start connecting and grow your
											friend circle!
										</span>
									)}
								</EmptyDescription>
								{isEmptyAll && (
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

export default FriendsPane;
