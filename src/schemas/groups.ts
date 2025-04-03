import * as z from "zod";
import { MemberRole } from "@prisma/client";

export const NewGroupSchema = z.object({
	groupName: z
		.string()
		.min(1, { message: "Group name is required" })
		.max(100, { message: "Group name must be at most 100 characters long" }),
	groupDescription: z
		.string()
		.max(200, { message: "Group description must be at most 200 characters long" })
		.optional(),
	groupIcon: z.string().optional(),
	groupMemberIds: z
		.array(z.string())
		.min(1, { message: "Please select at least one group member." }),
});

export const UpdateGroupSchema = z.object({
	groupName: z
		.string()
		.max(100, { message: "Group name must be at most 100 characters long" })
		.optional(),
	groupDescription: z
		.string()
		.max(200, { message: "Group description must be at most 200 characters long" })
		.optional(),
	groupBannerColor: z
		.string()
		.regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {
			message: "Group banner color must be a valid hex color code (e.g., #FFF or #FFFFFF)",
		})
		.optional(),
	groupIcon: z.string().optional(),
});

export const AddGroupMemberSchema = z.object({
	userIdsToAdd: z
		.array(z.string())
		.min(1, { message: "Please provide at least one valid user ID." }),
});

export const UpdateMemberRoleSchema = z.object({
	memberRole: z.nativeEnum(MemberRole, { message: "Invalid member role" }),
});
