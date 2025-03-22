"use client";

import ImageGalleryItem from "@/app/messenger/(chat-features)/_components/chat-message/chat-message-image/image-gallery-item";
import { cn } from "@/utils/general/cn";

interface ImageGalleryProps {
	mediaGallery: {
		id: string;
		imagePath?: string;
		imageName: string;
		imageUrl: string;
	}[];
	maxVisibleImages?: number;
	isDownloadable?: Boolean;
}

const ImageGallery = ({
	mediaGallery,
	maxVisibleImages = 4,
	isDownloadable = true,
}: ImageGalleryProps) => {
	const isSingleImage = mediaGallery.length === 1;
	const hasMoreImages = mediaGallery.length > maxVisibleImages;
	const mediaGalleryArr = mediaGallery.slice(0, Math.min(mediaGallery.length, maxVisibleImages));

	return (
		<div className={cn("grid w-full gap-3", isSingleImage ? "grid-cols-1" : "grid-cols-2")}>
			{mediaGalleryArr.map(({ id, imagePath, imageName, imageUrl }, idx) => (
				<ImageGalleryItem
					key={id}
					imagePath={imagePath}
					imageName={imageName}
					imageUrl={imageUrl}
					hiddenImageCount={mediaGallery.length - maxVisibleImages}
					hasOverlay={hasMoreImages && idx === mediaGalleryArr.length - 1}
					isDownloadable={isDownloadable}
				/>
			))}
		</div>
	);
};

export default ImageGallery;
