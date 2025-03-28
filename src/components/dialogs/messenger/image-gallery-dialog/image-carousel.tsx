"use client";

import type { ImageMessageWithMedia } from "@/types";

import { useState, useEffect, useCallback, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { toast } from "sonner";

import Image from "next/image";

import ActionBar from "@/components/dialogs/messenger/image-gallery-dialog/action-bar";
import ImageCarouselNav from "@/components/dialogs/messenger/image-gallery-dialog/image-carousel-nav";
import ImageThumbnailBar from "@/components/dialogs/messenger/image-gallery-dialog/image-thumbnail-bar";

import { PLACEHOLDER_CHAT_IMAGE } from "@/constants/media";
import downloadFile from "@/utils/general/download-file";

interface ImageCarouselProps {
	imageMessages: ImageMessageWithMedia[];
	initialIndex?: number;
	onClose?: () => void;
}

const ImageCarousel = ({
	imageMessages,
	initialIndex = 0,
	onClose = () => {},
}: ImageCarouselProps) => {
	// Initialize the Embla carousel and API reference
	const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

	// State management for carousel operation
	const [isInitialized, setIsInitialized] = useState<boolean>(false);
	const [activeIndex, setActiveIndex] = useState<number>(initialIndex);
	const [isDownloading, setIsDownloading] = useState<boolean>(false);

	// Memoize the currently active image to avoid unnecessary re-renders
	const activeImage = useMemo(() => imageMessages.at(activeIndex), [activeIndex, imageMessages]);

	// Callback function to handle carousel slide selection updates
	const handleSelect = useCallback(() => {
		if (!emblaApi || !isInitialized) return;
		setActiveIndex(emblaApi.selectedScrollSnap());
	}, [isInitialized, emblaApi]);

	// Function to handle image downloads
	const handleDownload = useCallback(async () => {
		const imageUrl = activeImage?.media?.url;
		const imageName = activeImage?.fileName;

		if (!imageUrl) {
			toast.error("Unable to download");
			return;
		}

		setIsDownloading(true);
		try {
			await downloadFile({
				url: imageUrl,
				filename: imageName ?? "downloaded-image",
			});
		} catch (err) {
			if (err instanceof Error) toast.error(err.message);
		} finally {
			setIsDownloading(false);
		}
	}, [activeImage?.fileName, activeImage?.media?.url]);

	// Handle carousel initialization and sync state when emblaApi becomes available
	useEffect(() => {
		if (emblaApi) {
			emblaApi.scrollTo(initialIndex, true); // Scroll to the initial slide on mount
			setActiveIndex(initialIndex); // Set active index state
			setIsInitialized(true); // Mark the carousel as initialized
			emblaApi.on("select", handleSelect); // Listen for slide change events
		}
	}, [emblaApi, handleSelect, initialIndex]);

	return (
		<>
			<ActionBar isDownloading={isDownloading} onDownload={handleDownload} onClose={onClose} />
			<div className="relative">
				<div className="relative flex min-h-96 items-center justify-center">
					<div className="w-full overflow-hidden" ref={emblaRef}>
						<div className="flex w-full">
							{imageMessages.map((img, idx) => (
								<div
									key={img.id}
									className="relative flex h-80 w-full shrink-0 flex-col items-center"
								>
									<Image
										src={img.media?.url ?? PLACEHOLDER_CHAT_IMAGE}
										alt={img.fileName ?? `slide-${idx}`}
										fill
										sizes="(max-width: 768px) 100vw, 50vw"
										className="object-contain"
									/>
								</div>
							))}
						</div>
					</div>
				</div>
				<div className="flex min-h-10 select-none items-start justify-center px-5 pt-1">
					<p className="text-center text-sm">{activeImage?.caption}</p>
				</div>
				<ImageCarouselNav
					onPrev={() => emblaApi?.scrollPrev()}
					onNext={() => emblaApi?.scrollNext()}
					canPrev={activeIndex > 0}
					canNext={activeIndex < imageMessages.length - 1}
				/>
			</div>
			<ImageThumbnailBar
				imageMessages={imageMessages}
				activeIndex={activeIndex}
				onClick={(index) => emblaApi?.scrollTo(index)}
			/>
		</>
	);
};

export default ImageCarousel;
