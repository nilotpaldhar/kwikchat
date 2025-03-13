import * as z from "zod";

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
