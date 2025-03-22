"use client";

import { useState } from "react";
import { toast } from "sonner";

import Image from "next/image";
import { IKImage } from "imagekitio-next";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import downloadFile from "@/utils/general/download-file";

interface ImageGalleryItemProps {
	imagePath?: string;
	imageName: string;
	imageUrl: string;
	hiddenImageCount: number;
	hasOverlay?: Boolean;
	isDownloadable?: Boolean;
}

const ImageGalleryItem = ({
	imagePath,
	imageName,
	imageUrl,
	hiddenImageCount,
	hasOverlay,
	isDownloadable = true,
}: ImageGalleryItemProps) => {
	const [isDownloading, setIsDownloading] = useState(false);

	const handleDownload = async () => {
		setIsDownloading(true);

		try {
			await downloadFile({
				url: imageUrl,
				filename: imageName,
			});
		} catch (err) {
			if (err instanceof Error) toast.error(err.message);
		} finally {
			setIsDownloading(false);
		}
	};

	return (
		<div className="group relative aspect-square overflow-hidden rounded-xl">
			<div className="relative size-full">
				{imagePath ? (
					<IKImage path={imagePath} alt={imageName} fill className="object-cover" />
				) : (
					<Image src={imageUrl} alt={imageName} fill className="object-cover" />
				)}
			</div>

			{!hasOverlay && isDownloadable ? (
				<div className="absolute inset-0 size-full opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100">
					<Button
						size="icon"
						variant="outline"
						disabled={false}
						onClick={handleDownload}
						className="absolute right-2 top-2 z-10 size-8 rounded-full border-transparent bg-transparent text-white ring-offset-neutral-900 hover:bg-white/10 dark:border-transparent dark:bg-transparent dark:text-white dark:ring-offset-neutral-900 dark:hover:bg-white/10"
					>
						{isDownloading ? (
							<Loader2 size={16} className="animate-spin" />
						) : (
							<Download size={16} />
						)}
					</Button>
					<span className="absolute inset-0 block size-full bg-gradient-to-b from-neutral-900 to-transparent to-50%" />
				</div>
			) : null}

			{hasOverlay ? (
				<div className="absolute inset-0 flex size-full select-none items-center justify-center bg-neutral-900/70">
					<div className="flex items-center space-x-0.5 text-4xl leading-none text-neutral-200 sm:text-4xl">
						<span>+</span>
						<span>{hiddenImageCount}</span>
					</div>
				</div>
			) : null}
		</div>
	);
};

export default ImageGalleryItem;
