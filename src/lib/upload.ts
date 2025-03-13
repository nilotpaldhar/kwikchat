import "server-only";

import { ChatAttachmentTypes } from "@/types";

import { nanoid } from "nanoid";
import { imagekitClient } from "@/lib/imagekit/client";
import { ROOT_MEDIA_FOLDER } from "@/constants/media";

interface UploadResponse {
	fileId: string;
	name: string;
	size: number;
	filePath: string;
	url: string;
	fileType: string;
	height?: number;
	width?: number;
	thumbnailUrl?: string;
}

/*
 * Function to upload an image to the server using ImageKit.
 * Accepts a base64 image string, an image name, and an optional folder path.
 * Returns an UploadResponse object or throws an error on failure.
 */
const uploadImage = async ({
	image,
	imageName,
	folder,
}: {
	image: string; // Base64 string
	imageName: string;
	folder?: string;
}): Promise<UploadResponse> => {
	try {
		const res = await imagekitClient.upload({
			file: image,
			fileName: `${imageName}-${nanoid()}`,
			folder: folder ? `${ROOT_MEDIA_FOLDER}/${folder}` : `${ROOT_MEDIA_FOLDER}/images`,
		});

		return res;
	} catch (error) {
		throw new Error("Image upload failed. Please check the file format and size, and try again.");
	}
};

/*
 * Function to upload a file to the server using ImageKit.
 * Accepts a base64 file string, a file name, and an optional folder path.
 * Returns an UploadResponse object or throws an error on failure.
 */
const uploadFile = async ({
	file,
	fileName,
	folder,
}: {
	file: string; // Base64 string
	fileName: string;
	folder?: string;
}) => {
	try {
		const res = await imagekitClient.upload({
			file: file,
			fileName: `${fileName}-${nanoid()}`,
			folder: folder ? `${ROOT_MEDIA_FOLDER}/${folder}` : `${ROOT_MEDIA_FOLDER}/files`,
		});

		return res;
	} catch (error) {
		throw new Error(
			"File upload failed. Ensure the file meets the required format and size limits, then try again."
		);
	}
};

/*
 * Function to delete an image or file from ImageKit.
 * Accepts a file ID and attempts to delete the file.
 * Returns the response from ImageKit or throws an error on failure.
 */
const deleteImageOrFile = async ({ fileId }: { fileId: string }) => {
	try {
		const res = await imagekitClient.deleteFile(fileId);
		return res;
	} catch (error) {
		throw new Error(
			"Failed to delete the image/file. Please check if the file exists and try again."
		);
	}
};

/*
 * Function to upload a user avatar.
 */
const uploadAvatar = async ({
	avatar,
	username,
	userId,
}: {
	avatar: string;
	username: string;
	userId: string;
}) => {
	try {
		return await uploadImage({
			image: avatar,
			imageName: `${username}-avatar`,
			folder: `${userId}/avatars`,
		});
	} catch (error) {
		return null;
	}
};

/*
 * Function to upload a group icon.
 */
const uploadGroupIcon = async ({
	icon,
	groupId,
	userId,
}: {
	icon: string;
	groupId?: string;
	userId: string;
}) => {
	try {
		return await uploadImage({
			image: icon,
			imageName: groupId ? `${groupId}-icon` : `unknown-group-icon`,
			folder: `${userId}/group-icons`,
		});
	} catch (error) {
		return null;
	}
};

/*
 * Function to upload an attachment in a chat.
 */
const uploadAttachment = async ({
	attachmentUrl,
	attachmentType,
	attachmentName,
	isGroup,
	userId,
	conversationId,
}: {
	attachmentUrl: string;
	attachmentType: ChatAttachmentTypes;
	attachmentName: string;
	userId: string;
	isGroup: boolean;
	conversationId: string; // This now replaces both receiverId and groupId
}) => {
	// Construct base folder path
	const conversationType = isGroup ? "group" : "private";
	const folder = `${userId}/conversations/${conversationType}/${conversationId}`;

	// Determine the correct subfolder based on attachment type
	const subfolder = attachmentType === ChatAttachmentTypes.Document ? "documents" : "images";

	try {
		switch (attachmentType) {
			case ChatAttachmentTypes.Document: {
				return await uploadFile({
					file: attachmentUrl,
					fileName: attachmentName,
					folder: `${folder}/${subfolder}`,
				});
			}

			case ChatAttachmentTypes.Image: {
				return await uploadImage({
					image: attachmentUrl,
					imageName: attachmentName,
					folder: `${folder}/${subfolder}`,
				});
			}

			default: {
				return null;
			}
		}
	} catch (error) {
		return null;
	}
};

export {
	uploadImage,
	uploadFile,
	deleteImageOrFile,
	uploadAvatar,
	uploadGroupIcon,
	uploadAttachment,
};
