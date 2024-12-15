"use client";

import { Fragment } from "react";
import { useRouter, usePathname } from "next/navigation";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Block, BlockTitle, BlockDescription } from "@/components/ui/block";
import {
	type CarouselOptions,
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";

import ErrorAlert from "@/app/messenger/_components/error-alert";
import LoadingSkeleton from "@/app/messenger/_components/online-friends-list/loading-skeleton";
import OnlineFriendItem from "@/app/messenger/_components/online-friends-list/online-friend-item";

import { useFriendsQuery } from "@/hooks/tanstack-query/use-friend";

import { cn } from "@/utils/general/cn";
import buildOpenChatUrl from "@/utils/messenger/build-open-chat-url";

interface OnlineFriendsListProps {
	carouselOptions?: CarouselOptions;
	className?: string;
	classNames?: {
		skeleton?: string;
		carousel?: string;
		carouselContent?: string;
	};
}

const OnlineFriendsList = ({ carouselOptions, className, classNames }: OnlineFriendsListProps) => {
	const router = useRouter();
	const pathname = usePathname();

	const {
		data,
		isLoading,
		isError,
		isSuccess,
		isFetching,
		hasNextPage,
		error,
		refetch,
		fetchNextPage,
	} = useFriendsQuery({ isOnline: true });
	const isEmpty = isSuccess && (data?.pages[0].data?.items.length ?? 0) <= 0;

	const handleInitChat = (friendId: string) => {
		const url = buildOpenChatUrl(friendId, pathname);
		router.push(url);
	};

	if (!isLoading && !isError && isEmpty) return null;

	return (
		<Block className={cn("space-y-3", className)}>
			<BlockTitle>Online Now</BlockTitle>
			<BlockDescription>
				{isLoading && <LoadingSkeleton className={classNames?.skeleton} />}
				{!isLoading && isError && (
					<ErrorAlert onClick={() => refetch()}>{error.message}</ErrorAlert>
				)}
				{!isLoading && isSuccess && data?.pages && (
					<Carousel
						opts={{ align: "start", ...carouselOptions }}
						className={cn("w-full", classNames?.carousel)}
					>
						<CarouselContent className={classNames?.carouselContent}>
							{data.pages.map((page) =>
								page.data?.items ? (
									<Fragment key={page.data?.pagination.page}>
										{page.data?.items.map((friend) => (
											<CarouselItem key={friend.id} className="basis-14">
												<div>
													<OnlineFriendItem {...friend} onClick={handleInitChat} />
												</div>
											</CarouselItem>
										))}
									</Fragment>
								) : null
							)}
							{hasNextPage && (
								<CarouselItem className="basis-14">
									<div className="flex size-11 items-center justify-center">
										<Button
											variant="outline"
											size="icon"
											disabled={isFetching}
											onClick={() => fetchNextPage()}
											className="size-9 rounded-full"
										>
											<ArrowRight size={16} />
											<span className="sr-only">Load More</span>
										</Button>
									</div>
								</CarouselItem>
							)}
						</CarouselContent>
					</Carousel>
				)}
			</BlockDescription>
		</Block>
	);
};

export default OnlineFriendsList;
