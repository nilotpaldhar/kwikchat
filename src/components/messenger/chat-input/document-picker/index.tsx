"use client";

import type { ChatDocumentAttachment } from "@/types";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import CustomFileInput from "@/components/ui/custom-file-input";
import DocumentUploadDialog from "@/components/messenger/chat-input/document-picker/document-upload-dialog";

import { MAX_CHAT_DOCUMENT_FILE_SIZE } from "@/constants/media";
import { SUPPORTED_DOCUMENT_FILE_MESSAGE_TYPES } from "@/constants/chat-input";

import { readFile } from "@/lib/crop-image";
import { getFileDetails, formatFileSize, type FileDetails } from "@/utils/general/file";

interface DocumentPickerProps {
	className?: string;
	children: React.ReactNode;
	onConfirmUpload?: (data: ChatDocumentAttachment) => void;
}

// Utility function to validate document file type
const isValidDocumentFileType = (
	fileType: string
): fileType is (typeof SUPPORTED_DOCUMENT_FILE_MESSAGE_TYPES)[number] =>
	[...SUPPORTED_DOCUMENT_FILE_MESSAGE_TYPES].includes(fileType as never);

const DocumentPicker = ({ className, children, onConfirmUpload }: DocumentPickerProps) => {
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);
	const [document, setDocument] = useState<File | null>(null);
	const [documentDetails, setDocumentDetails] = useState<FileDetails | null>(null);

	// Generate the accepted file formats for the input element
	const fileAcceptAttribute = SUPPORTED_DOCUMENT_FILE_MESSAGE_TYPES.map(
		(type) => `.${type.toLocaleLowerCase()}`
	).join(",");

	// Handle file selection and validation
	const handleChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
		// Get the selected file from the input element
		const selectedFile = evt.target.files?.[0];
		if (!selectedFile) return;

		// Extract file details such as type and size
		const { fileType, fileSize, ...restFileDetails } = getFileDetails(selectedFile);

		// Check if the file exceeds the maximum allowed size
		if (selectedFile.size > MAX_CHAT_DOCUMENT_FILE_SIZE) {
			toast.error("Document size too large.", {
				description: `The selected document is ${fileSize.formatted}, exceeding the ${formatFileSize(MAX_CHAT_DOCUMENT_FILE_SIZE)} limit.`,
				position: "top-right",
			});

			// Reset input field to allow re-selection
			evt.target.value = "";

			return;
		}

		// Check if the selected file type is supported
		if (!isValidDocumentFileType(fileType)) {
			toast.error("File type not supported.", {
				description: `The selected file type (${fileType}) is not allowed. Please upload a supported document format: ${SUPPORTED_DOCUMENT_FILE_MESSAGE_TYPES.join(", ")}.`,
				position: "top-right",
			});

			// Reset input field to allow re-selection
			evt.target.value = "";

			return;
		}

		// Open preview modal with the selected document details
		setIsPreviewOpen(true);
		setDocument(selectedFile);

		// Update document details only if the file type is different from the previous one
		setDocumentDetails((prev) =>
			prev?.fileType === fileType ? prev : { fileType, fileSize, ...restFileDetails }
		);

		// Reset input field to allow re-selection
		evt.target.value = "";
	}, []);

	// Handle confirmation of the document upload
	const handleConfirmUpload = async (caption?: string) => {
		if (!document || !documentDetails) return;

		try {
			const documentDataUrl = (await readFile(document)) as string | null;
			if (onConfirmUpload) {
				onConfirmUpload({
					document: documentDetails,
					documentDataUrl,
					caption,
				});
			}

			setIsPreviewOpen(false);
		} catch (error) {
			toast.error("Something went wrong");
		}
	};

	// Reset file states when preview modal is closed
	useEffect(() => {
		if (!isPreviewOpen) {
			setDocument(null);
			setDocumentDetails(null);
		}
	}, [isPreviewOpen]);

	return (
		<>
			<CustomFileInput
				multiple={false}
				className={className}
				accept={fileAcceptAttribute}
				onChange={handleChange}
			>
				{children}
			</CustomFileInput>
			<DocumentUploadDialog
				open={isPreviewOpen}
				documentDetails={documentDetails}
				onOpenChange={setIsPreviewOpen}
				onConfirmUpload={({ caption }) => handleConfirmUpload(caption)}
			/>
		</>
	);
};

export default DocumentPicker;
