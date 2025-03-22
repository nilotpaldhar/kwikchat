"use client";

import type { DocumentMessage } from "@prisma/client";

import { useState } from "react";
import { toast } from "sonner";

import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DocumentIcon from "@/components/messenger/document-icon";

import { useMessageMediaAttachmentsQuery } from "@/hooks/tanstack-query/use-media";

import { cn } from "@/utils/general/cn";
import downloadFile from "@/utils/general/download-file";
import { isTempId } from "@/utils/general/temp-id-generator";
import { formatFileSize, truncateFileName } from "@/utils/general/file";

interface ChatMessageDocumentProps {
	conversationId: string;
	messageId: string;
	isSender: boolean;
	attachment: DocumentMessage | null;
	className?: string;
}

const ChatMessageDocument = ({
	conversationId,
	messageId,
	isSender,
	attachment,
	className,
}: ChatMessageDocumentProps) => {
	const [isDownloading, setIsDownloading] = useState(false);

	// Check if media query should be enabled
	const canFetchMedia = !isTempId(messageId);

	// Format document details
	const shortenedDocName = truncateFileName(attachment?.fileName ?? "Unknown", 10);
	const formattedDocSize = formatFileSize(attachment?.fileSize ?? 0);
	const hasDocCaption = Boolean(attachment?.caption && attachment.caption.length > 0);

	// Fetch media details
	const { data, isLoading, isError, error } = useMessageMediaAttachmentsQuery({
		conversationId,
		messageId,
		enabled: canFetchMedia,
	});

	// Handle document download
	const handleDownload = async () => {
		const documentUrl = data?.data?.[0].url;
		const canDownload = !isError && documentUrl;

		if (isError && error) {
			toast.error(error.message ?? "Failed to retrieve document details.");
			return;
		}

		if (!canDownload) {
			toast.error("Document is unavailable for download.");
			return;
		}

		setIsDownloading(true);

		try {
			await downloadFile({
				url: documentUrl,
				filename: attachment?.fileName ?? "document",
			});
		} catch (err) {
			if (err instanceof Error) toast.error(err.message);
		} finally {
			setIsDownloading(false);
		}
	};

	return (
		<div
			className={cn(
				"w-56 overflow-hidden rounded-xl p-3 shadow-md sm:w-80",
				isSender
					? "rounded-tr-none bg-primary-400 text-neutral-50"
					: "rounded-tl-none bg-surface-light-100 dark:bg-surface-dark-400",
				className
			)}
		>
			<div className={cn("flex h-full w-full items-center")}>
				<div className="w-full">
					<div className={cn("flex items-center space-x-3")}>
						{/* Document Information */}
						<div
							className={cn(
								"flex size-11 items-center justify-center rounded-md",
								isSender
									? "bg-surface-light-200 text-neutral-700"
									: "bg-surface-light-200 text-neutral-700 dark:bg-surface-dark-300 dark:text-neutral-200"
							)}
						>
							<DocumentIcon fileType={attachment?.fileType} size={20} />
						</div>

						{/* File Details */}
						<div className="flex flex-1 flex-col space-y-0.5">
							<div className="text-sm font-semibold">{shortenedDocName}</div>
							<div
								className={cn(
									"flex flex-wrap items-center gap-1.5 whitespace-nowrap text-xs font-medium",
									isSender ? "text-neutral-200" : "text-neutral-500 dark:text-neutral-200"
								)}
							>
								<span>{attachment?.fileType}</span>
								<span
									className={cn(
										"block size-1 rounded-full",
										isSender ? "bg-neutral-200" : "bg-neutral-500 dark:bg-neutral-200"
									)}
								/>
								<span>{formattedDocSize}</span>
							</div>
						</div>

						{/* Download Button */}
						<div className="flex items-center justify-center">
							<Button
								size="icon"
								variant="outline"
								disabled={!canFetchMedia || isLoading}
								onClick={handleDownload}
								className={cn(
									"size-8 rounded-full border-transparent bg-transparent dark:border-transparent dark:bg-transparent",
									isSender
										? "text-current ring-offset-primary-400 hover:bg-white/10 focus-visible:ring-neutral-200 dark:ring-offset-primary-400 hover:dark:bg-white/10 dark:focus-visible:ring-neutral-200"
										: "dark:ring-offset-surface-dark-400"
								)}
							>
								{isDownloading ? (
									<Loader2 size={16} className="animate-spin" />
								) : (
									<Download size={16} />
								)}
							</Button>
						</div>
					</div>

					{/* Divider */}
					{hasDocCaption ? (
						<div
							className={cn(
								"rounded-ful mb-1.5 mt-3 h-px w-full",
								isSender ? "bg-white/10" : "bg-neutral-200/50 dark:bg-neutral-700/15"
							)}
						/>
					) : null}

					{/* Caption */}
					{hasDocCaption ? (
						<div className="px-px text-sm leading-6">{attachment?.caption}</div>
					) : null}
				</div>
			</div>
		</div>
	);
};

export default ChatMessageDocument;
