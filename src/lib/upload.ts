import "server-only";

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

async function uploadImage({
	image,
	imageName,
	folder,
}: {
	image: string; // Base64 string
	imageName: string;
	folder?: string;
}): Promise<UploadResponse> {
	try {
		const res = await imagekitClient.upload({
			file: image,
			fileName: `${imageName}-${nanoid()}`,
			folder: folder ? `${ROOT_MEDIA_FOLDER}/${folder}` : ROOT_MEDIA_FOLDER,
		});

		return res;
	} catch (error) {
		throw new Error("Image upload failed. Please check the file format and size, and try again.");
	}
}

async function uploadFile({
	file,
	fileName,
	folder,
}: {
	file: string; // Base64 string
	fileName: string;
	folder?: string;
}) {
	try {
		const res = await imagekitClient.upload({
			file: file,
			fileName: `${fileName}-${nanoid()}`,
			folder: folder ? `${ROOT_MEDIA_FOLDER}/${folder}` : ROOT_MEDIA_FOLDER,
		});

		return res;
	} catch (error) {
		throw new Error(
			"File upload failed. Ensure the file meets the required format and size limits, then try again."
		);
	}
}

async function deleteImageOrFile({ fileId }: { fileId: string }) {
	try {
		const res = await imagekitClient.deleteFile(fileId);
		return res;
	} catch (error) {
		throw new Error(
			"Failed to delete the image/file. Please check if the file exists and try again."
		);
	}
}

export { uploadImage, uploadFile, deleteImageOrFile };
