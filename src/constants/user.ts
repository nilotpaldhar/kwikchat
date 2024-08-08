/* eslint-disable import/prefer-default-export */
import { MAX_AVATAR_SIZE } from "@/constants/media";

const MESSAGE_NOT_KNOWN = "We apologize, but an error has occurred with the server";
const MESSAGE_INVALID_FIELDS = "Invalid input detected" as string;

export const AVATAR_UPLOAD_MESSAGE = {
	error: {
		notKnown: MESSAGE_NOT_KNOWN,
		invalidFields: MESSAGE_INVALID_FIELDS,
		unauthorized: "Unauthorized",
		maxFileSize: `The avatar file exceeds the ${MAX_AVATAR_SIZE / 1024} KB size limit.`,
		unableToSave:
			"Unable to save avatar. Please ensure the file meets all requirements, such as size and format, and try again.",
		failedToUpload:
			"Avatar upload failed. Please ensure the file meets all requirements, such as size and format,  and try uploading again.",
	},
} as const;

export const PROFILE_UPDATE_MESSAGE = {
	error: {
		updateProfile:
			"Unable to update profile. Please check your internet connection and try again. If the problem persists, ensure that all required fields are filled out correctly and that the file formats and sizes meet the specified requirements.",
	},
	success: {
		updateProfile:
			"Profile has been successfully updated. All changes have been saved and are now visible on your account. If you need to make further adjustments, please feel free to do so at any time.",
	},
} as const;
