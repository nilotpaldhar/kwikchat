import type { NextAuthConfig } from "next-auth";

// Providers
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

import { SigninSchema } from "@/schemas";
import validateCredentials from "@/lib/auth/validate-credentials";

export default {
	providers: [
		Google({
			clientId: process.env.AUTH_GOOGLE_ID,
			clientSecret: process.env.AUTH_GOOGLE_SECRET,
		}),
		Credentials({
			credentials: {
				email: { type: "email", label: "Email", placeholder: "hello@example.com" },
				password: { type: "password", label: "Password" },
			},
			async authorize(credentials) {
				const validatedFields = SigninSchema.safeParse(credentials);

				if (validatedFields.success) {
					const { email, password } = validatedFields.data;
					const { user } = await validateCredentials({ email, password });
					return user;
				}

				return null;
			},
		}),
	],
} satisfies NextAuthConfig;
