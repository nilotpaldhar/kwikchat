import "server-only";

import { nanoid } from "nanoid";
import { media } from "@/lib/media";
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
		const res = await media.upload({
			file: image,
			fileName: `${imageName}-${nanoid()}`,
			folder: folder ? `${ROOT_MEDIA_FOLDER}/${folder}` : ROOT_MEDIA_FOLDER,
		});

		return res;
	} catch (error) {
		throw new Error("Image upload failed");
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
		const res = await media.upload({
			file: file,
			fileName: `${fileName}-${nanoid()}`,
			folder: folder ? `${ROOT_MEDIA_FOLDER}/${folder}` : ROOT_MEDIA_FOLDER,
		});

		return res;
	} catch (error) {
		throw new Error("File upload failed");
	}
}

export { uploadImage, uploadFile };
