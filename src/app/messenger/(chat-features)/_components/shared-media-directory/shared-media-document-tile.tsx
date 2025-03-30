"use client";

import type { Media } from "@prisma/client";

import { useState } from "react";
import { toast } from "sonner";

import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DocumentIcon from "@/components/messenger/document-icon";

import downloadFile from "@/utils/general/download-file";
import { formatFileSize, truncateFileName } from "@/utils/general/file";

interface SharedMediaDocumentTileProps {
	media: Media;
}

const SharedMediaDocumentTile = ({ media }: SharedMediaDocumentTileProps) => {
	const [isDownloading, setIsDownloading] = useState(false);

	const shortenedDocName = truncateFileName(media.name);
	const formattedDocSize = formatFileSize(media.size);

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
		<div className="w-full overflow-hidden rounded-md border border-neutral-200 p-2 dark:border-neutral-800">
			<div className="flex w-full items-center space-x-2 sm:space-x-3">
				<div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-surface-light-200 text-neutral-700 dark:bg-surface-dark-300 dark:text-neutral-400">
					<DocumentIcon fileType={media.fileExtension} size={20} />
				</div>
				<div className="flex flex-1 flex-col space-y-0.5">
					<div className="max-w-14 truncate text-sm font-medium xs:max-w-full">
						{shortenedDocName}
					</div>
					<div className="flex flex-wrap items-center gap-1.5 whitespace-nowrap text-xs font-medium text-neutral-500 dark:text-neutral-400">
						<span className="uppercase">{media.fileExtension ?? "unknown"}</span>
						<span className="hidden size-1 rounded-full bg-neutral-200 dark:bg-neutral-700 xs:block" />
						<span className="hidden xs:block">{formattedDocSize}</span>
					</div>
				</div>
				<div className="flex items-center justify-center">
					<Button
						size="icon"
						variant="outline"
						disabled={isDownloading}
						onClick={handleDownload}
						className="size-8 rounded-full border-transparent bg-transparent dark:border-transparent dark:bg-transparent dark:hover:bg-neutral-800"
					>
						{isDownloading ? (
							<Loader2 size={16} className="animate-spin" />
						) : (
							<Download size={16} />
						)}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default SharedMediaDocumentTile;
