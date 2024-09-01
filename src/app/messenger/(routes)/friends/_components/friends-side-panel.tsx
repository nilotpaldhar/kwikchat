"use client";

import Link from "next/link";
import { ChevronRightIcon, XOctagon } from "lucide-react";

import { cn } from "@/utils/general/cn";
import { useRecentFriendRequestsQuery } from "@/hooks/use-friend-request";

import { Button, buttonVariants } from "@/components/ui/button";
import { Block, BlockTitle } from "@/components/ui/block";
import { Alert, AlertTitle } from "@/components/ui/alert";

import {
	SidePanel,
	SidePanelHeader,
	SidePanelContent,
} from "@/app/messenger/_components/side-panel";
import {
	FriendRequestList,
	FriendRequestListSkeleton,
} from "@/app/messenger/(routes)/friends/_components/friend-request-list";

const FriendsSidePanel = () => {
	const { data, isError, isLoading, isSuccess, isFetching, error, refetch } =
		useRecentFriendRequestsQuery();
	const totalPendingRequests = data?.data?.pagination.totalItems ?? 0;

	return (
		<SidePanel>
			<SidePanelHeader>
				<h1 className="heading-3">Friends</h1>
			</SidePanelHeader>
			<SidePanelContent className="px-0">
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
					{(isLoading || isFetching) && <FriendRequestListSkeleton count={5} className="px-5" />}
					{!isLoading && !isFetching && isError && (
						<Alert variant="danger" closable={false}>
							<XOctagon />
							<AlertTitle>
								<span>{error.message}</span>
								<Button
									variant="link"
									onClick={() => refetch()}
									className="ml-1 h-auto p-0 font-semibold text-red-600 underline"
								>
									Retry
								</Button>
							</AlertTitle>
						</Alert>
					)}
					{!isLoading && !isFetching && isSuccess && data?.data?.items && (
						<FriendRequestList
							collection={data?.data?.items}
							showUsername={false}
							itemClassName="px-5 rounded-none"
						/>
					)}
				</div>
			</SidePanelContent>
		</SidePanel>
	);
};

export default FriendsSidePanel;
