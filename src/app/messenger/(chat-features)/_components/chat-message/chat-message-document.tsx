"use client";

import type { DocumentMessage } from "@prisma/client";

import { Download } from "lucide-react";
// import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DocumentIcon from "@/components/messenger/document-icon";

import { cn } from "@/utils/general/cn";
import { formatFileSize, truncateFileName } from "@/utils/general/file";

interface ChatMessageDocumentProps {
	isSender: boolean;
	content: DocumentMessage | null;
	className?: string;
}

const ChatMessageDocument = ({ isSender, content, className }: ChatMessageDocumentProps) => {
	const documentName = truncateFileName(content?.fileName ?? "Unknown", 10);
	const documentSize = formatFileSize(content?.fileSizeBytes ?? 0);
	const hasCaption = Boolean(content?.caption && content.caption.length > 0);

	return (
		<div
			className={cn(
				"w-56 overflow-hidden rounded-xl px-3 shadow-md sm:w-80 lg:w-96",
				isSender
					? "rounded-tr-none bg-primary-400 text-neutral-50"
					: "rounded-tl-none bg-surface-light-100 dark:bg-surface-dark-400",
				hasCaption ? "pb-2 pt-4" : "py-4",
				className
			)}
		>
			<div className={cn("flex h-full w-full items-center")}>
				<div className="w-full">
					<div className={cn("flex items-center space-x-3")}>
						<div
							className={cn(
								"flex size-11 items-center justify-center rounded-md",
								isSender
									? "bg-surface-light-200 text-neutral-700"
									: "bg-surface-light-200 text-neutral-700 dark:bg-surface-dark-300 dark:text-neutral-200"
							)}
						>
							<DocumentIcon fileType={content?.fileType} size={20} />
						</div>
						<div className="flex flex-1 flex-col space-y-0.5">
							<div className="text-sm font-semibold">{documentName}</div>
							<div
								className={cn(
									"flex flex-wrap items-center gap-1.5 whitespace-nowrap text-xs font-medium",
									isSender ? "text-neutral-200" : "text-neutral-500 dark:text-neutral-200"
								)}
							>
								<span>{content?.fileType}</span>
								<span
									className={cn(
										"block size-1 rounded-full",
										isSender ? "bg-neutral-200" : "bg-neutral-500 dark:bg-neutral-200"
									)}
								/>
								<span>{documentSize}</span>
							</div>
						</div>
						<div className="flex items-center justify-center">
							<Button
								size="icon"
								variant="outline"
								disabled
								className={cn(
									"size-8 rounded-full border-transparent bg-transparent dark:border-transparent dark:bg-transparent",
									isSender
										? "text-current ring-offset-primary-400 hover:bg-white/10 focus-visible:ring-neutral-200 dark:ring-offset-primary-400 hover:dark:bg-white/10 dark:focus-visible:ring-neutral-200"
										: "dark:ring-offset-surface-dark-400"
								)}
							>
								<Download size={16} />
							</Button>
						</div>
					</div>
					{hasCaption ? (
						<div
							className={cn(
								"rounded-ful mb-1.5 mt-3 h-px w-full",
								isSender ? "bg-white/10" : "bg-neutral-200/50 dark:bg-neutral-700/15"
							)}
						/>
					) : null}
					{hasCaption ? <div className="px-px text-sm leading-6">{content?.caption}</div> : null}
				</div>
			</div>
		</div>
	);
};

export default ChatMessageDocument;
