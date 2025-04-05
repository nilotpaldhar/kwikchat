/* eslint-disable no-underscore-dangle */

import { NewGroupSchema } from "@/schemas";
import { MAX_GROUP_ICON_SIZE } from "@/constants/media";

interface ValidationResult {
	isValid: boolean;
	error: string | null;
}

/**
 * Validates the provided group name against the NewGroupSchema.
 */
const validateGroupName = (groupName: string): ValidationResult => {
	const { success, error } = NewGroupSchema.pick({ groupName: true }).safeParse({ groupName });
	const errMsg = error?.format().groupName?._errors[0] ?? "Unexpected error";
	if (!success) return { isValid: false, error: errMsg };
	return { isValid: true, error: null };
};

/**
 * Validates the provided group description against the NewGroupSchema.
 */
const validateGroupDescription = (description: string): ValidationResult => {
	const { success, error } = NewGroupSchema.pick({ groupDescription: true }).safeParse({
		groupDescription: description,
	});
	const errMsg = error?.format().groupDescription?._errors[0] ?? "Unexpected error";
	if (!success) return { isValid: false, error: errMsg };
	return { isValid: true, error: null };
};

/**
 * Validates the uploaded group icon file.
 */
const validateGroupIcon = (icon: File): ValidationResult => {
	// Check if the file type starts with 'image/' to determine if it's an image
	const isImgFile = icon.type.startsWith("image/");

	// If the file is not an image, return an error
	if (!isImgFile) {
		return {
			isValid: false,
			error: "Invalid file type. Please upload an image (JPG, PNG, GIF).",
		};
	}

	// Check if the file size exceeds the maximum allowed size
	if (icon.size > MAX_GROUP_ICON_SIZE) {
		return {
			isValid: false,
			error: `The icon file exceeds the ${MAX_GROUP_ICON_SIZE / 1024} KB size limit.`,
		};
	}

	return { isValid: true, error: null };
};

/**
 * Validates the provided group members against the NewGroupSchema.
 */
const validateGroupMembers = (groupMembers: string[]): ValidationResult => {
	const { success, error } = NewGroupSchema.pick({ groupMemberIds: true }).safeParse({
		groupMemberIds: groupMembers,
	});
	const errMsg = error?.format().groupMemberIds?._errors[0] ?? "Unexpected error";
	if (!success) return { isValid: false, error: errMsg };
	return { isValid: true, error: null };
};

export { validateGroupName, validateGroupDescription, validateGroupIcon, validateGroupMembers };
