"use client";

import { Media } from "@prisma/client";

import { Block, BlockTitle, BlockContent } from "@/components/ui/block";

import SharedMediaImageTile from "@/app/messenger/(chat-features)/_components/shared-media-directory/shared-media-image-tile";
import SharedMediaDocumentTile from "@/app/messenger/(chat-features)/_components/shared-media-directory/shared-media-document-tile";

import { cn } from "@/utils/general/cn";

interface SharedMediaDateGroupProps {
	month: string;
	mediaList: Media[];
	isImageTab?: boolean;
	isDocumentTab?: boolean;
}

const SharedMediaDateGroup = ({
	month,
	mediaList,
	isImageTab,
	isDocumentTab,
}: SharedMediaDateGroupProps) => (
	<Block className="space-y-2">
		<BlockTitle className="text-neutral-500 dark:text-neutral-400">{month}</BlockTitle>
		<BlockContent
			className={cn(
				"grid gap-3",
				isImageTab && "grid-cols-2 md:grid-cols-3",
				isDocumentTab && "grid-cols-1"
			)}
		>
			{mediaList.map((media) => (
				<div
					key={media.id}
					className={cn(isImageTab && "aspect-square", isDocumentTab && "w-full")}
				>
					{isImageTab ? <SharedMediaImageTile media={media} /> : null}
					{isDocumentTab ? <SharedMediaDocumentTile media={media} /> : null}
				</div>
			))}
		</BlockContent>
	</Block>
);

export default SharedMediaDateGroup;
