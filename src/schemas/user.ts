import * as z from "zod";

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
