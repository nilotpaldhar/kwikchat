"use client";

import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";

import UIBlocker from "@/components/ui/ui-blocker";
import { Block, BlockTitle } from "@/components/ui/block";
import { buttonVariants } from "@/components/ui/button";

import ErrorAlert from "@/app/messenger/_components/error-alert";

import { List, ListSkeleton } from "@/app/messenger/(friends-management)/_components/list";
import FriendRequestTile from "@/app/messenger/(friends-management)/_components/friend-request-tile";

import { cn } from "@/utils/general/cn";
import { useRecentFriendRequestsQuery } from "@/hooks/tanstack-query/use-friend-request";

const FriendRequestsPane = () => {
	const { data, isError, isLoading, isSuccess, isFetching, error, refetch } =
		useRecentFriendRequestsQuery();
	const totalPendingRequests = data?.data?.pagination.totalItems ?? 0;
	const isEmpty = isSuccess && (data?.data?.items.length ?? 0) <= 0;

	if (isEmpty) return null;

	return (
		<div>
			<Block className="px-5">
				<BlockTitle className="flex items-center justify-between pb-4 text-neutral-500 dark:text-neutral-400">
					<span>Pending Requests - {totalPendingRequests}</span>
					{totalPendingRequests > 5 && (
						<Link
							href="/messenger/friends/pending"
							className={cn(
								buttonVariants({ variant: "outline" }),
								"h-auto space-x-1 border-transparent p-0 text-xs font-semibold capitalize leading-5 text-neutral-500 hover:bg-transparent dark:border-transparent dark:text-neutral-400 dark:hover:bg-transparent"
							)}
						>
							<span>See All</span>
							<ChevronRightIcon size={12} />
						</Link>
					)}
				</BlockTitle>
			</Block>
			<div className="relative">
				{isLoading && <ListSkeleton className="px-5" />}
				{!isLoading && isError && (
					<ErrorAlert onClick={() => refetch()}>{error.message}</ErrorAlert>
				)}
				{!isLoading && isSuccess && data?.data?.items && (
					<List key={data?.data?.pagination.page}>
						{data?.data?.items.map((friendRequest) => (
							<li key={friendRequest.id}>
								<FriendRequestTile
									key={friendRequest.id}
									{...friendRequest}
									showUsername={false}
									className="rounded-none px-5"
								/>
							</li>
						))}
					</List>
				)}
				<UIBlocker
					isBlocking={!isLoading && isFetching}
					spinnerClassName="text-neutral-500 dark:text-neutral-400"
				/>
			</div>
		</div>
	);
};
export default FriendRequestsPane;
