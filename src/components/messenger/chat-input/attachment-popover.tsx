"use client";

import type { ChatDocumentAttachment, ChatImageAttachment } from "@/types";
import { ChatAttachmentTypes } from "@/types";

import { Plus, File, Image } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

import ImagePicker from "@/components/messenger/chat-input/image-picker";
import DocumentPicker from "@/components/messenger/chat-input/document-picker";

import { cn } from "@/utils/general/cn";

export type ChatAttachmentUploadPayload =
	| { type: ChatAttachmentTypes.Document; data: ChatDocumentAttachment }
	| { type: ChatAttachmentTypes.Image; data: ChatImageAttachment[] };
export type OnAttachmentUpload = (data: ChatAttachmentUploadPayload) => void;

interface AttachmentPopoverProps {
	className?: string;
	onAttachmentUpload?: OnAttachmentUpload;
}

const AttachmentPopover = ({ className, onAttachmentUpload }: AttachmentPopoverProps) => {
	const actionBtnClassName = buttonVariants({
		variant: "outline",
		className:
			"w-full justify-start space-x-2 border-transparent bg-transparent px-1.5 text-left hover:bg-surface-light-300 dark:border-transparent dark:hover:bg-surface-dark-500",
	});

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					size="icon"
					variant="outline"
					className={cn(
						"rounded-full bg-transparent text-neutral-500 dark:bg-transparent dark:text-neutral-400",
						className
					)}
				>
					<Plus size={20} />
					<span className="sr-only">Attachments</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent
				side="top"
				sideOffset={24}
				align="start"
				alignOffset={0}
				className="max-w-48 flex-col space-y-1 p-1.5"
			>
				<DocumentPicker
					className={actionBtnClassName}
					onConfirmUpload={(data) => {
						if (onAttachmentUpload)
							onAttachmentUpload({ type: ChatAttachmentTypes.Document, data });
					}}
				>
					<File size={16} />
					<span className="font-semibold">Document</span>
				</DocumentPicker>
				<ImagePicker
					className={actionBtnClassName}
					onConfirmUpload={(data) => {
						if (onAttachmentUpload) onAttachmentUpload({ type: ChatAttachmentTypes.Image, data });
					}}
				>
					<Image size={16} />
					<span className="font-semibold">Photos</span>
				</ImagePicker>
			</PopoverContent>
		</Popover>
	);
};

export default AttachmentPopover;
