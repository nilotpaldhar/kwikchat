"use client";

import type { Media } from "@prisma/client";

import { useState } from "react";
import { toast } from "sonner";

import Image from "next/image";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import downloadFile from "@/utils/general/download-file";

interface SharedMediaImageTileProps {
	media: Media;
}

const SharedMediaImageTile = ({ media }: SharedMediaImageTileProps) => {
	const [isDownloading, setIsDownloading] = useState(false);

	const handleDownload = async () => {
		setIsDownloading(true);
		try {
			await downloadFile({
				url: media.url,
				filename: media.name,
			});
		} catch (err) {
			if (err instanceof Error) toast.error(err.message);
		} finally {
			setIsDownloading(false);
		}
	};

	return (
		<div className="group relative flex size-full items-center justify-center overflow-hidden rounded-md">
			<Image
				src={media.url}
				alt={media.name}
				fill
				sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 15vw"
				className="object-cover"
			/>
			<div className="absolute inset-0 size-full opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100">
				<Button
					size="icon"
					variant="outline"
					disabled={false}
					onClick={handleDownload}
					className="absolute right-1 top-1 z-10 size-8 rounded-full border-transparent bg-transparent text-white ring-offset-neutral-900 hover:bg-white/10 dark:border-transparent dark:bg-transparent dark:text-white dark:ring-offset-neutral-900 dark:hover:bg-white/10"
				>
					{isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
				</Button>
				<span className="absolute inset-0 block size-full bg-gradient-to-b from-neutral-900 to-transparent to-50%" />
			</div>
		</div>
	);
};
export default SharedMediaImageTile;
