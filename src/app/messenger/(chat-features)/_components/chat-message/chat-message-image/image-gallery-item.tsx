"use client";

import { useState } from "react";
import { toast } from "sonner";

import Image from "next/image";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import { cn } from "@/utils/general/cn";
import downloadFile from "@/utils/general/download-file";

interface ImageGalleryItemProps {
	imageName: string;
	imageUrl: string;
	hiddenImageCount: number;
	isSender: Boolean;
	hasOverlay?: Boolean;
	isDownloadable?: Boolean;
	onClick?: () => void;
}

const ImageGalleryItem = ({
	imageName,
	imageUrl,
	hiddenImageCount,
	isSender,
	hasOverlay,
	isDownloadable = true,
	onClick = () => {},
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

	const handleRootKeyDown = (evt: React.KeyboardEvent<HTMLDivElement>) => {
		if (evt.key === "Enter" || evt.key === " ") {
			evt.preventDefault();
			onClick();
		}
	};

	const handleDownloadBtnClick = (evt: React.MouseEvent<HTMLButtonElement>) => {
		evt.stopPropagation();
		handleDownload();
	};

	const handleDownloadBtnKeyDown = (evt: React.KeyboardEvent<HTMLButtonElement>) => {
		if (evt.key === "Enter" || evt.key === " ") {
			evt.preventDefault();
			evt.stopPropagation();
			handleDownload();
		}
	};

	return (
		<div
			tabIndex={0}
			role="button"
			aria-label=""
			onClick={onClick}
			onKeyDown={handleRootKeyDown}
			className={cn(
				"group relative aspect-square overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
				isSender
					? "ring-offset-primary-400 focus-visible:ring-neutral-200"
					: "ring-offset-white focus-visible:ring-neutral-500 dark:ring-offset-surface-dark-400 dark:focus-visible:ring-neutral-600"
			)}
		>
			<div className="relative size-full">
				<Image
					src={imageUrl}
					alt={imageName}
					fill
					sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 15vw"
					className="object-cover"
				/>
			</div>

			{!hasOverlay && isDownloadable ? (
				<div className="absolute inset-0 size-full opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100">
					<Button
						size="icon"
						variant="outline"
						disabled={false}
						onClick={handleDownloadBtnClick}
						onKeyDown={handleDownloadBtnKeyDown}
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
