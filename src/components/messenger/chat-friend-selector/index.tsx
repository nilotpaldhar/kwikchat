"use client";

import { useState } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Empty, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

import SearchBar from "@/components/search-bar";
import InfiniteScroll from "@/components/infinite-scroll";
import FriendTile from "@/components/messenger/friend-tile";
import FriendsSkeleton from "@/components/skeletons/friends-skeleton";

import ErrorAlert from "@/components/messenger/chat-friend-selector/error-alert";
import FilterFriends from "@/components/messenger/chat-friend-selector/filter-friends";

import { useFriendsQuery } from "@/hooks/tanstack-query/use-friend";

interface ChatFriendSelectorProps {
	isGroup?: boolean;
	defaultSelectedIds?: string[];
	onSelect?: (friendId: string, selected: boolean) => void;
}

const ChatFriendSelector = ({
	isGroup = false,
	defaultSelectedIds = [],
	onSelect,
}: ChatFriendSelectorProps) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [isOnline, setIsOnline] = useState(false);

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

	const isEmpty = isSuccess && (data?.pages[0].data?.items.length ?? 0) <= 0;
	const isEmptyOnline = isEmpty && isOnline;
	const isSearchEmpty = isEmpty && searchQuery.length > 0;

	return (
		<div className="flex flex-col space-y-6">
			<div className="px-4 sm:px-5 lg:px-6">
				<SearchBar
					placeholder="Search"
					onSearch={(searchTerm) => setSearchQuery(searchTerm)}
					wrapperClassName="dark:bg-surface-dark-300"
					disabled={isFetching}
				/>
			</div>
			<div className="flex flex-col space-y-4">
				<div className="flex items-center justify-between px-4 sm:px-5 lg:px-6">
					<h3 className="paragraph font-semibold">Friends</h3>
					<FilterFriends
						disabled={isFetching}
						onChange={(filter) => setIsOnline(filter === "online")}
					/>
				</div>
				<div>
					{isLoading && (
						<FriendsSkeleton wrapperClassName="space-y-0" className="px-4 sm:px-5 lg:px-6" />
					)}

					{!isLoading && isError && (
						<div className="px-4 sm:px-5 lg:px-6">
							<ErrorAlert onClick={() => refetch()}>{error.message}</ErrorAlert>
						</div>
					)}

					{!isLoading && isSuccess && data?.pages && (
						<ScrollArea className="h-[340px]">
							{!isEmpty ? (
								<InfiniteScroll next={fetchNextPage} loading={isFetchingNextPage}>
									<div className="flex flex-col space-y-2 pb-2">
										{data.pages.map((page) =>
											page.data?.items ? (
												<ul key={page.data?.pagination.page} className="flex flex-col">
													{page.data?.items.map((friend) => (
														<li key={friend.id} className="">
															<FriendTile
																{...friend}
																className="px-4 sm:px-5 lg:px-6"
																defaultSelected={defaultSelectedIds.includes(friend.id)}
																showCheckbox={isGroup}
																onChange={onSelect}
															/>
														</li>
													))}
												</ul>
											) : null
										)}
									</div>
								</InfiniteScroll>
							) : (
								<Empty className="pt-14">
									<EmptyTitle className="mt-0 text-base">
										{isSearchEmpty && <span>No result found for &quot;{searchQuery}&quot;</span>}
										{!isSearchEmpty && isEmptyOnline && <span>No Friends Online</span>}
										{!isSearchEmpty && !isEmptyOnline && (
											<span>You haven&apos;t made any friends yet!</span>
										)}
									</EmptyTitle>
									{!isSearchEmpty && (
										<EmptyDescription className="max-w-xs text-xs leading-5">
											{isEmptyOnline ? (
												<span>
													None of your friends are currently online. Check back later or send them a
													message to reconnect!
												</span>
											) : (
												<span>
													You haven&apos;t made any new friends recently. Start connecting and grow
													your friend circle!
												</span>
											)}
										</EmptyDescription>
									)}
								</Empty>
							)}
						</ScrollArea>
					)}
				</div>
			</div>
		</div>
	);
};

export default ChatFriendSelector;
