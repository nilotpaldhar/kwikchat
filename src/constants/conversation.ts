export const INIT_GROUP_CONVERSATION_MESSAGE = {
	error: {
		invalidFields: "Invalid input detected",
		unauthorized: "Unauthorized",
		invalidMembers:
			"Only your friends can be added as group members. Please select friends to include in the group.",
		iconUploadFailed: "Group icon upload failed. Please try again or use a different image format.",
		notKnown: "Group creation unsuccessful. Please check your network connection and try again.",
	},
} as const;
