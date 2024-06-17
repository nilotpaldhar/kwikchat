import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { prisma } from "@/lib/db";
import authConfig from "@/auth.config";
import { getUserById } from "@/data/user";
import generateUniqueUsername from "@/utils/general/generate-unique-username";

export const {
	handlers: { GET, POST },
	signIn,
	signOut,
	auth,
} = NextAuth({
	pages: {
		signIn: "/sign-in",
	},
	callbacks: {
		async signIn({ user, account }) {
			/** Allow OAuth without email verification */
			if (account?.provider !== "credentials") return true;

			/** Prevent signin without email verification */
			const existingUser = await getUserById(user.id as string);
			if (!existingUser || !existingUser.emailVerified) return false;

			return true;
		},
		async jwt({ token }) {
			if (!token.sub) return null;

			const existingUser = await getUserById(token.sub);
			if (!existingUser) return null;

			token.displayName = existingUser.displayName;
			token.username = existingUser.username;
			token.bio = existingUser.bio;
			token.createdAt = existingUser.createdAt;

			return token;
		},
		async session({ session, token }) {
			if (token.sub && session.user) session.user.id = token.sub;

			if (session.user) {
				session.user.displayName = token.displayName as string;
				session.user.username = token.username as string;
				session.user.bio = (token.bio as string) ?? "";
				session.user.createdAt = token.createdAt as Date;
			}

			return session;
		},
	},
	events: {
		async linkAccount({ user }) {
			const displayName = user?.name ?? "Unknown";
			const usernamePrefix = user?.name || "user";
			const username = generateUniqueUsername(usernamePrefix);

			await prisma.user.update({
				where: { id: user.id },
				data: {
					displayName,
					username,
					emailVerified: new Date(),
					userSettings: { create: {} },
				},
			});
		},
	},
	adapter: PrismaAdapter(prisma),
	session: { strategy: "jwt" },
	debug: process.env.NODE_ENV === "development",
	...authConfig,
});
