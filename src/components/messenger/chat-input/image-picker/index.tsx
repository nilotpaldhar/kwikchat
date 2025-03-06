"use client";

import type { ChatImageAttachment, ImageUpload } from "@/types";

import { useEffect, useReducer, useCallback } from "react";

import { toast } from "sonner";
import { nanoid } from "nanoid";

import CustomFileInput from "@/components/ui/custom-file-input";
import ImageUploadDialog from "@/components/messenger/chat-input/image-picker/image-upload-dialog";

import { MAX_CHAT_IMAGE_FILE_SIZE } from "@/constants/media";
import {
	MAX_IMAGE_SELECTION_LIMIT,
	SUPPORTED_IMAGE_FILE_MESSAGE_TYPES,
} from "@/constants/chat-input";

import { readFile, getCroppedImg } from "@/lib/crop-image";
import { getFileDetails, formatFileSize } from "@/utils/general/file";

interface ImagePickerProps {
	className?: string;
	children: React.ReactNode;
	onConfirmUpload?: (data: ChatImageAttachment[]) => void;
}

// Reducer Action Types
type ActionTypes =
	| { type: "SET_PREVIEW_OPEN"; payload: boolean }
	| { type: "INIT_IMAGE_UPLOADS"; payload: ImageUpload[] }
	| { type: "REMOVE_FROM_IMAGE_UPLOADS"; payload: string }
	| { type: "SET_SELETED_IMAGE_UPLOAD"; payload: ImageUpload | null }
	| { type: "UPDATE_SELECTED_IMAGE"; payload: ImageUpload }
	| { type: "RESET" };

// Initial State
const initialState = {
	isPreviewOpen: false,
	imageUploads: [] as ImageUpload[],
	selectedImageUpload: null as ImageUpload | null,
};

// Reducer Function
const reducer = (state: typeof initialState, action: ActionTypes) => {
	switch (action.type) {
		case "SET_PREVIEW_OPEN":
			return { ...state, isPreviewOpen: action.payload };
		case "INIT_IMAGE_UPLOADS":
			return { ...state, imageUploads: action.payload };
		case "REMOVE_FROM_IMAGE_UPLOADS":
			return {
				...state,
				imageUploads: state.imageUploads.filter((imgUpload) => imgUpload.id !== action.payload),
			};
		case "SET_SELETED_IMAGE_UPLOAD":
			return { ...state, selectedImageUpload: action.payload };
		case "UPDATE_SELECTED_IMAGE":
			return {
				...state,
				imageUploads: state.imageUploads.map((img) =>
					img.id === state.selectedImageUpload?.id ? action.payload : img
				),
				selectedImageUpload: state.selectedImageUpload ? action.payload : null,
			};
		case "RESET":
			return initialState;
		default:
			return state;
	}
};

// Utility function to read file as data URL
const getImageUrl = async (image: File): Promise<string | null> => {
	const imgDataUrl = await readFile(image);
	return typeof imgDataUrl === "string" ? imgDataUrl : null;
};

const ImagePicker = ({ className, children, onConfirmUpload }: ImagePickerProps) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	// Generate accept attribute for file input
	const fileAcceptAttribute = SUPPORTED_IMAGE_FILE_MESSAGE_TYPES.map(
		(type) => `.${type.toLocaleLowerCase()}`
	).join(",");

	// Checks if selected images exceed the allowed size limit.
	const checkImageSizeLimit = (selectedFiles: File[]) => {
		const oversizedFiles: File[] = [];
		selectedFiles.forEach((file) => {
			if (file.size > MAX_CHAT_IMAGE_FILE_SIZE) oversizedFiles.push(file);
		});

		if (oversizedFiles.length > 0) {
			return {
				isValid: false,
				oversizedFileNames: oversizedFiles.map((file) => getFileDetails(file).fileName),
			};
		}

		return { isValid: true, oversizedFileNames: [] };
	};

	// Checks if selected images have a supported file type.
	const checkImageType = (selectedFiles: File[]) => {
		const unspportedFiles: File[] = [];
		selectedFiles.forEach((file) => {
			if (!SUPPORTED_IMAGE_FILE_MESSAGE_TYPES.includes(getFileDetails(file).fileType)) {
				unspportedFiles.push(file);
			}
		});

		if (unspportedFiles.length > 0) {
			return {
				isValid: false,
				unspportedFilesNames: unspportedFiles.map((file) => getFileDetails(file).fileName),
			};
		}

		return { isValid: true, unspportedFilesNames: [] };
	};

	// Handles removing an image from the uploaded list.
	const handleRemoveImage = (image: ImageUpload) => {
		const updatedImages = state.imageUploads.filter((img) => img.id !== image.id);
		const removedIndex = state.imageUploads.findIndex((img) => img.id === image.id);

		let newSelectedImage = state.selectedImageUpload;

		// If the removed image was selected, determine the next selection
		if (state.selectedImageUpload?.id === image.id) {
			if (updatedImages.length === 0) {
				newSelectedImage = null; // No images left, clear selection
			} else if (removedIndex > 0) {
				newSelectedImage = updatedImages[removedIndex - 1]; // Select previous image
			} else {
				newSelectedImage = updatedImages[0]; // Select first image if removed was at index 0
			}
		}

		dispatch({ type: "REMOVE_FROM_IMAGE_UPLOADS", payload: image.id });
		dispatch({ type: "SET_SELETED_IMAGE_UPLOAD", payload: newSelectedImage });
		if (updatedImages.length === 0) dispatch({ type: "SET_PREVIEW_OPEN", payload: false });
	};

	// Handles file selection and validates images.
	const handleChange = useCallback(
		async (evt: React.ChangeEvent<HTMLInputElement>, append = false) => {
			// Get the selected files from the input event
			const selectedFiles = evt.target.files;
			if (!selectedFiles || selectedFiles?.length === 0) return;

			// Convert selected files to an array and append them to existing uploads (if required)
			const selectedFilesArr: File[] = append
				? [
						...state.imageUploads.map((imageUpload) => imageUpload.image), // Preserve existing images
						...Array.from(selectedFiles), // Append newly selected images
					]
				: Array.from(selectedFiles); // Use only the newly selected images if not appending

			// Check if the selected images exceed the maximum selection limit
			if (selectedFilesArr.length > MAX_IMAGE_SELECTION_LIMIT) {
				toast.error("Image selection limit exceeded.", {
					description: `You can select up to ${MAX_IMAGE_SELECTION_LIMIT} images per message.`,
					position: "top-right",
				});

				// Reset input field to allow re-selection
				evt.target.value = "";

				return;
			}

			// Validate selected image sizes
			const { isValid: isValidImageSize, oversizedFileNames } =
				checkImageSizeLimit(selectedFilesArr);
			if (!isValidImageSize) {
				toast.error("Image size limit exceeded.", {
					description: (
						<div className="space-y-0.5">
							<p>
								The following image(s) exceed the {formatFileSize(MAX_CHAT_IMAGE_FILE_SIZE)} limit:
							</p>
							<ol className="space-y-0.5 pl-2">
								{oversizedFileNames.map((fileName, idx) => (
									<li key={fileName} className="flex items-center space-x-1">
										<span>{idx + 1}.</span>
										<span>{fileName}</span>
									</li>
								))}
							</ol>
						</div>
					),
					position: "top-right",
				});

				// Reset input field to allow re-selection
				evt.target.value = "";

				return;
			}

			// Validate selected image types
			const { isValid: isValidImageType, unspportedFilesNames } = checkImageType(selectedFilesArr);
			if (!isValidImageType) {
				toast.error("Image type not supported.", {
					description: (
						<div className="space-y-0.5">
							<p>The following images have an unsupported format:</p>
							<ol className="space-y-0.5 pl-2">
								{unspportedFilesNames.map((fileName, idx) => (
									<li key={fileName} className="flex items-center space-x-1">
										<span>{idx + 1}.</span>
										<span>{fileName}</span>
									</li>
								))}
							</ol>
							<p>
								Supported formats: {SUPPORTED_IMAGE_FILE_MESSAGE_TYPES.join(", ")}. Please upload a
								valid image file.
							</p>
						</div>
					),
					position: "top-right",
				});

				// Reset input field to allow re-selection
				evt.target.value = "";

				return;
			}

			// Convert each selected image file to a data URL asynchronously
			const imageDataUrlsResults = await Promise.allSettled(selectedFilesArr.map(getImageUrl));

			// Construct an array of ImageUpload objects with metadata
			const imageUploadsArr: ImageUpload[] = selectedFilesArr.map((selectedFile, idx) => {
				const imageUrlResult = imageDataUrlsResults[idx];
				return {
					id: nanoid(),
					image: selectedFile,
					imageUrl: imageUrlResult.status === "fulfilled" ? imageUrlResult.value : null,
					crop: { x: 0, y: 0 },
					zoom: 1,
					caption: "",
					cropPixels: null,
				};
			});

			// Update the component state with the new images
			dispatch({ type: "SET_PREVIEW_OPEN", payload: true });
			dispatch({ type: "INIT_IMAGE_UPLOADS", payload: imageUploadsArr });
			dispatch({ type: "SET_SELETED_IMAGE_UPLOAD", payload: imageUploadsArr.at(0) ?? null });

			// Reset input field to allow re-selection
			evt.target.value = "";
		},
		[state.imageUploads]
	);

	// Processes images before submitting.
	const handleSubmit = useCallback(async () => {
		const processImageUpload = async (upload: ImageUpload) => {
			try {
				let processedImageUrl: string | null = upload.imageUrl;

				// Apply cropping if crop data exists
				if (upload.imageUrl && upload.cropPixels) {
					processedImageUrl = await getCroppedImg(upload.imageUrl, upload.cropPixels);
				}

				return {
					caption: upload.caption,
					image: upload.image,
					imageDataUrl: processedImageUrl,
				};
			} catch (error) {
				return {
					caption: upload.caption,
					image: upload.image,
					imageDataUrl: null,
				};
			}
		};

		// Process all uploaded images concurrently
		const imageAttachments: ChatImageAttachment[] = await Promise.all(
			state.imageUploads.map(processImageUpload)
		);

		dispatch({ type: "SET_PREVIEW_OPEN", payload: false });
		if (onConfirmUpload) onConfirmUpload(imageAttachments);
	}, [state.imageUploads, onConfirmUpload]);

	// Reset state when preview is closed
	useEffect(() => {
		if (!state.isPreviewOpen) dispatch({ type: "RESET" });
	}, [state.isPreviewOpen]);

	return (
		<>
			<CustomFileInput
				className={className}
				accept={fileAcceptAttribute}
				multiple
				onChange={handleChange}
			>
				{children}
			</CustomFileInput>
			<ImageUploadDialog
				open={state.isPreviewOpen}
				onOpenChange={(open) => dispatch({ type: "SET_PREVIEW_OPEN", payload: open })}
				imageUploads={state.imageUploads}
				selectedImageUpload={state.selectedImageUpload}
				supportedImageTypes={fileAcceptAttribute}
				onSelectImage={(image: ImageUpload) =>
					dispatch({ type: "SET_SELETED_IMAGE_UPLOAD", payload: image })
				}
				onAppendImage={(evt) => handleChange(evt, true)}
				onRemoveImage={handleRemoveImage}
				onUpdateImage={(image) => dispatch({ type: "UPDATE_SELECTED_IMAGE", payload: image })}
				onSubmit={handleSubmit}
			/>
		</>
	);
};

export default ImagePicker;
