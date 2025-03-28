"use client";

import type { ImageMessageWithMedia } from "@/types";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ImageThumbnail from "@/components/dialogs/messenger/image-gallery-dialog/image-thumbnail";

import { cn } from "@/utils/general/cn";

interface ImageThumbnailBarProps {
	imageMessages: ImageMessageWithMedia[];
	activeIndex: number;
	onClick: (index: number) => void;
	className?: string;
}

const ImageThumbnailBar = ({
	imageMessages,
	activeIndex,
	onClick,
	className,
}: ImageThumbnailBarProps) => (
	<div className={cn("border-t border-neutral-200 px-5 py-2 dark:border-neutral-800", className)}>
		<div className="flex w-full items-center justify-center overflow-hidden">
			<ScrollArea className="max-w-56 py-2 sm:max-w-sm md:max-w-md lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl">
				<div className="flex flex-row items-center justify-center gap-1.5 p-1.5">
					{imageMessages.map((img, idx) => (
						<ImageThumbnail
							key={img.id}
							imgUrl={img.media?.url}
							isActive={activeIndex === idx}
							onClick={() => onClick(idx)}
						/>
					))}
				</div>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
		</div>
	</div>
);

export default ImageThumbnailBar;
