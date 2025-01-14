import * as z from "zod";

import { MAX_MESSAGE_CHAR_LENGTH } from "@/constants/chat-input";
import { MemberRole, MessageReactionType } from "@prisma/client";

export const SigninSchema = z.object({
	email: z.string().email({ message: "Please enter a valid email address" }),
	password: z.string().min(1, { message: "Please enter a valid password" }),
	otp: z.string().min(4, { message: "Please enter a valid otp" }).optional().or(z.literal("")),
});

export const SignupSchema = z.object({
	username: z.string().refine((val) => /^[a-zA-Z0-9_]{3,16}$/gm.test(val ?? ""), {
		message: "Please enter a valid username",
	}),
	email: z.string().email({ message: "Please enter a valid email address" }),
	password: z.string().refine((val) => /^(?=.*[A-Z])(?=.*\d).{8,}$/gm.test(val ?? ""), {
		message: "Please enter a valid password",
	}),
	tos: z.boolean().refine((val) => val === true, {
		message: "Please read and accept the terms and conditions",
	}),
});

export const ForgotPasswordSchema = z.object({
	email: z.string().email({ message: "Please enter a valid email address" }),
});

export const ResetPasswordSchema = z
	.object({
		password: z.string().refine((val) => /^(?=.*[A-Z])(?=.*\d).{8,}$/gm.test(val ?? ""), {
			message: "Please enter a valid password",
		}),
		confirmPassword: z.string(),
	})
	.superRefine(({ confirmPassword, password }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({
				code: "custom",
				message: "Please make sure your passwords match",
				path: ["confirmPassword"],
			});
		}
	});

export const UpdatePasswordSchema = z
	.object({
		currentPassword: z.string().min(1, { message: "Please enter your current password" }),
		newPassword: z.string().refine((val) => /^(?=.*[A-Z])(?=.*\d).{8,}$/gm.test(val ?? ""), {
			message: "Please enter a valid password",
		}),
		confirmNewPassword: z.string(),
	})
	.superRefine(({ confirmNewPassword, newPassword }, ctx) => {
		if (confirmNewPassword !== newPassword) {
			ctx.addIssue({
				code: "custom",
				message: "Please make sure your passwords match",
				path: ["confirmNewPassword"],
			});
		}
	});

export const Toggle2FASchema = z.object({
	password: z.string().min(1, { message: "Please enter a valid password" }),
});

export const UpdateUsernameSchema = z.object({
	newUsername: z.string().refine((val) => /^[a-zA-Z0-9_]{3,16}$/gm.test(val ?? ""), {
		message: "Please enter a valid username",
	}),
	currentPassword: z.string().min(1, { message: "Please enter your current password" }),
});

export const ProfileSchema = z.object({
	displayName: z.string().nullable().optional(),
	bannerColor: z.string().nullable().optional(),
	bio: z.string().max(190, "Bio must be 190 characters or fewer").nullable().optional(),
	avatar: z.string().nullable().optional(),
});

export const TextMessageSchema = z.object({
	message: z
		.string()
		.trim()
		.min(1, { message: "Message content cannot be empty." })
		.max(
			MAX_MESSAGE_CHAR_LENGTH,
			`Your message is too long (over ${MAX_MESSAGE_CHAR_LENGTH} characters). Please shorten it and try again.`
		),
});

export const SeenMessageSchema = z.object({
	messageIds: z.array(z.string()),
});

export const MessageReactionSchema = z.object({
	reactionType: z.nativeEnum(MessageReactionType),
	emoji: z.string().emoji().min(1, "Emoji is required"),
	emojiImageUrl: z.string().url("Emoji image URL is not valid "),
});

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
