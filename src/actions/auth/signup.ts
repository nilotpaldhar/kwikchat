"use server";

import bcrypt from "bcryptjs";

import * as z from "zod";
import { SignupSchema } from "@/schemas";

import { prisma } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/auth/tokens";
import { getUserByEmail, getUserByUsername } from "@/data/user";

import { SIGNUP_MESSAGE as MESSAGE } from "@/constants/auth";

async function signup(values: z.infer<typeof SignupSchema>) {
	const validatedFields = SignupSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: MESSAGE.error.invalidFields };
	}

	const { email, username, password } = validatedFields.data;

	/** Check email */
	const existingUserWithEmail = await getUserByEmail(email);
	if (existingUserWithEmail && existingUserWithEmail?.email) {
		return { error: MESSAGE.error.emailTaken };
	}

	/** Check username */
	const existingUserWithUsername = await getUserByUsername(username);
	if (existingUserWithUsername && existingUserWithUsername?.email) {
		return { error: MESSAGE.error.usernameTaken };
	}

	/** Hash password */
	const hashedPassword = await bcrypt.hash(password, 10);

	try {
		await prisma.user.create({
			data: {
				email,
				username,
				displayName: "Unknown",
				password: hashedPassword,
				userSettings: { create: {} },
			},
		});

		const verificationToken = await generateVerificationToken(email);
		await sendVerificationEmail({ email, token: verificationToken.token });

		return { success: MESSAGE.success.verificationEmail };
	} catch (error) {
		return { error: MESSAGE.error.notKnown };
	}
}

export default signup;
