"use client";

import type { ChatDocumentAttachment } from "@/types";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button, type ButtonProps } from "@/components/ui/button";
import DocumentPreviewDialog from "@/components/messenger/chat-input/document-picker/document-preview-dialog";

import { MAX_CHAT_DOCUMENT_FILE_SIZE } from "@/constants/media";
import { SUPPORTED_DOCUMENT_FILE_MESSAGE_TYPES } from "@/constants/chat-input";

import { getFileDetails, formatFileSize, type FileDetails } from "@/utils/general/file";

interface FilePickerProps extends ButtonProps {
	children: React.ReactNode;
	onConfirmUpload?: (data: ChatDocumentAttachment) => void;
}

const DocumentPicker = ({ children, className, onConfirmUpload, ...props }: FilePickerProps) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);
	const [document, setDocument] = useState<File | null>(null);
	const [documentDetails, setDocumentDetails] = useState<FileDetails | null>(null);

	const fileAcceptAttribute = SUPPORTED_DOCUMENT_FILE_MESSAGE_TYPES.map(
		(type) => `.${type.toLocaleLowerCase()}`
	).join(",");

	// Reset file input so the same file can be selected again
	const handleResetFileInput = () => {
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	// Show an error toast for oversized files
	const handleDocumentTooLarge = (fileSize: string) => {
		toast.error("Document size too large.", {
			description: `The selected document is ${fileSize}, exceeding the ${formatFileSize(MAX_CHAT_DOCUMENT_FILE_SIZE)} limit.`,
			position: "top-right",
		});
	};

	// Show an error toast for unsupported files
	const handleUnsupportedDocument = (fileType: string) => {
		toast.error("File type not supported.", {
			description: `The selected file type (${fileType}) is not allowed. Please upload a supported document format: ${SUPPORTED_DOCUMENT_FILE_MESSAGE_TYPES.join(", ")}.`,
			position: "top-right",
		});
	};

	const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = evt.target.files?.[0];
		if (!selectedFile) return;

		const { fileType, fileSize, ...restFileDetails } = getFileDetails(selectedFile);

		if (selectedFile.size > MAX_CHAT_DOCUMENT_FILE_SIZE) {
			handleDocumentTooLarge(fileSize);
			handleResetFileInput();
			return;
		}

		if (!SUPPORTED_DOCUMENT_FILE_MESSAGE_TYPES.includes(fileType)) {
			handleUnsupportedDocument(fileType);
			handleResetFileInput();
			return;
		}

		setIsPreviewOpen(true);
		setDocument(selectedFile);
		setDocumentDetails((prev) =>
			prev?.fileType === fileType ? prev : { fileType, fileSize, ...restFileDetails }
		);
	};

	const handleConfirmUpload = (caption?: string) => {
		if (document && onConfirmUpload) onConfirmUpload({ document, caption });
		setIsPreviewOpen(false);
	};

	useEffect(() => {
		if (!isPreviewOpen) {
			setDocument(null);
			setDocumentDetails(null);
			handleResetFileInput();
		}
	}, [isPreviewOpen]);

	return (
		<>
			<Button className={className} onClick={() => fileInputRef.current?.click()} {...props}>
				{children}
			</Button>
			<input
				type="file"
				className="hidden"
				ref={fileInputRef}
				accept={fileAcceptAttribute}
				onChange={handleChange}
			/>
			<DocumentPreviewDialog
				open={isPreviewOpen}
				documentDetails={documentDetails}
				onOpenChange={setIsPreviewOpen}
				onConfirmUpload={({ caption }) => handleConfirmUpload(caption)}
			/>
		</>
	);
};

export default DocumentPicker;
