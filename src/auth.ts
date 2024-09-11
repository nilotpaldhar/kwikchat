import { type UserSettings } from "@prisma/client";

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import authConfig from "@/auth.config";

import { prisma } from "@/lib/db";
import { setUserOnlineStatus } from "@/lib/user";
import { pusherServer } from "@/lib/pusher/server";

import { getUserById } from "@/data/user";
import { getFriendsOfUser } from "@/data/friendship";
import { getTwoFactorConfirmationByUserId } from "@/data/auth/two-factor-confirmation";

import { friendEvents } from "@/constants/pusher-events";
import generateUniqueUsername from "@/utils/general/generate-unique-username";

export const {
	handlers: { GET, POST },
	signIn,
	signOut,
	auth,
} = NextAuth({
	pages: {
		signIn: "/sign-in",
		error: "/sign-in/error",
	},
	callbacks: {
		async signIn({ user, account }) {
			/** Allow OAuth without email verification */
			if (account?.provider !== "credentials") return true;

			/** Prevent signin without email verification */
			const existingUser = await getUserById(user.id as string, true);
			if (!existingUser || !existingUser.emailVerified) return false;

			if (existingUser.userSettings?.twoFactorEnabled) {
				const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(user.id as string);
				if (!twoFactorConfirmation) return false;

				/** Delete two factor confirmation for next sign in */
				await prisma.twoFactorConfirmation.delete({
					where: { id: twoFactorConfirmation.id },
				});
			}

			return true;
		},
		async jwt({ token }) {
			if (!token.sub) return null;

			const existingUser = await getUserById(token.sub, true);
			if (!existingUser) return null;

			token.displayName = existingUser.displayName;
			token.username = existingUser.username;
			token.bio = existingUser.bio;
			token.createdAt = existingUser.createdAt;
			token.userSettings = existingUser.userSettings;

			return token;
		},
		async session({ session, token }) {
			if (token.sub && session.user) session.user.id = token.sub;

			if (session.user) {
				session.user.displayName = token.displayName as string;
				session.user.username = token.username as string;
				session.user.bio = (token.bio as string) ?? "";
				session.user.createdAt = token.createdAt as Date;
				session.user.settings = token.userSettings as UserSettings;
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
		async signIn({ user }) {
			// Check if the user object exists and has a valid user ID
			if (!user || !user.id) return;

			// Set the user's online status to true in the system
			await setUserOnlineStatus({ userId: user.id, isOnline: true });

			// Get the list of friends who are online and map their IDs
			const friends = await getFriendsOfUser({ userId: user.id, isOnline: true });
			const friendIds = friends.map((friend) => friend.id);

			// Trigger a Pusher event to notify the user's friends that the user is now online
			pusherServer.trigger(friendIds, friendEvents.online, user.id);
		},
	},
	adapter: PrismaAdapter(prisma),
	session: { strategy: "jwt" },
	debug: process.env.NODE_ENV === "development",
	...authConfig,
});
