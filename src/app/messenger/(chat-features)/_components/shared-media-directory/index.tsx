"use client";

import type { Media } from "@prisma/client";
import type { InfiniteData } from "@tanstack/react-query";
import type { APIResponse, MediaAttachmentFilterType, PaginatedResponse } from "@/types";

import { useCallback, useMemo, useState } from "react";

import Loader from "@/components/ui/loader";
import InfiniteScroll from "@/components/infinite-scroll";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ErrorAlert from "@/app/messenger/_components/error-alert";
import SharedMediaDateGroup from "@/app/messenger/(chat-features)/_components/shared-media-directory/shared-media-date-group";

import { useConversationMediaAttachmentsQuery } from "@/hooks/tanstack-query/use-media";
import groupMediaByMonth from "@/utils/messenger/group-media-by-month";

type TabType = Extract<MediaAttachmentFilterType, "image" | "document">;

interface SharedMediaDirectoryProps {
	conversationId: string;
}

// Define tab labels
const TAB_LABELS: Record<TabType, string> = {
	image: "Images",
	document: "Documents",
};

/**
 * Combines paginated media data into a single array.
 */
const combineMedia = (data?: InfiniteData<APIResponse<PaginatedResponse<Media>>>) => {
	if (!data) return [];
	return data.pages.flatMap((page) => page.data?.items ?? []);
};

const SharedMediaDirectory = ({ conversationId }: SharedMediaDirectoryProps) => {
	const [currentTab, setCurrentTab] = useState<TabType>("image");

	// Fetch media attachments using a custom hook with react-query
	const { data, isSuccess, isLoading, isFetchingNextPage, isError, error, refetch, fetchNextPage } =
		useConversationMediaAttachmentsQuery({
			conversationId,
			filter: currentTab,
		});

	// Memoizing combined media to prevent unnecessary calculations
	const combinedMedia = useMemo(() => combineMedia(data), [data]);

	// Memoizing grouped media to avoid recomputation on state updates
	const groupedMedia = useMemo(() => groupMediaByMonth(combinedMedia), [combinedMedia]);

	const isEmpty = isSuccess && combinedMedia.length === 0;

	const handleFilterChange = useCallback((value: string) => {
		if (value in TAB_LABELS) setCurrentTab(value as TabType);
	}, []);

	return (
		<Tabs value={currentTab} className="w-full" onValueChange={handleFilterChange}>
			<TabsList className="w-full">
				{Object.entries(TAB_LABELS).map(([value, label]) => (
					<TabsTrigger key={value} value={value}>
						{label}
					</TabsTrigger>
				))}
			</TabsList>

			{Object.keys(TAB_LABELS).map((value) => (
				<TabsContent key={value} value={value} className="p-5">
					{isLoading && (
						<div className="flex w-full items-center justify-center pt-40">
							<Loader />
						</div>
					)}

					{!isLoading && isError && (
						<ErrorAlert onClick={() => refetch()}>
							{error ? error.message : "Something went wrong!"}
						</ErrorAlert>
					)}

					{!isLoading && !isError && isEmpty && (
						<div className="px-5 pt-24">
							<Empty>
								<EmptyTitle>{`No Shared ${TAB_LABELS[currentTab]}`}</EmptyTitle>
								<EmptyDescription>
									{`No ${TAB_LABELS[currentTab].toLowerCase()} have been shared in this conversation.`}
								</EmptyDescription>
							</Empty>
						</div>
					)}

					{!isLoading && !isError && !isEmpty && (
						<InfiniteScroll next={fetchNextPage} loading={isFetchingNextPage}>
							<div className="flex flex-col space-y-4">
								{groupedMedia.map(({ month, mediaList }) => (
									<SharedMediaDateGroup
										key={month}
										month={month}
										mediaList={mediaList}
										isImageTab={currentTab === "image"}
										isDocumentTab={currentTab === "document"}
									/>
								))}
							</div>
						</InfiniteScroll>
					)}
				</TabsContent>
			))}
		</Tabs>
	);
};

export default SharedMediaDirectory;
