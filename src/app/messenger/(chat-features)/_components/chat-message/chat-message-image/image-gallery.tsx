"use client";

import ImageGalleryItem from "@/app/messenger/(chat-features)/_components/chat-message/chat-message-image/image-gallery-item";
import { cn } from "@/utils/general/cn";

interface ImageGalleryProps {
	mediaGallery: {
		id: string;
		imageName: string;
		imageUrl: string;
	}[];
	isSender: boolean;
	maxVisibleImages?: number;
	isDownloadable?: boolean;
	onGalleryItemClick?: (index: number) => void;
}

const ImageGallery = ({
	mediaGallery,
	isSender,
	maxVisibleImages = 4,
	isDownloadable = true,
	onGalleryItemClick = () => {},
}: ImageGalleryProps) => {
	const isSingleImage = mediaGallery.length === 1;
	const hasMoreImages = mediaGallery.length > maxVisibleImages;
	const mediaGalleryArr = mediaGallery.slice(0, Math.min(mediaGallery.length, maxVisibleImages));

	return (
		<div className={cn("grid w-full gap-3", isSingleImage ? "grid-cols-1" : "grid-cols-2")}>
			{mediaGalleryArr.map(({ id, imageName, imageUrl }, index) => (
				<ImageGalleryItem
					key={id}
					imageName={imageName}
					imageUrl={imageUrl}
					hiddenImageCount={mediaGallery.length - maxVisibleImages}
					isSender={isSender}
					hasOverlay={hasMoreImages && index === mediaGalleryArr.length - 1}
					isDownloadable={isDownloadable}
					onClick={() => onGalleryItemClick(index)}
				/>
			))}
		</div>
	);
};

export default ImageGallery;
