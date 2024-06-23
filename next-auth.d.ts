import { type DefaultSession } from "next-auth";
import { type UserSettings } from "@prisma/client";

export type ExtendedUser = DefaultSession["user"] & {
	displayName?: string;
	username?: string;
	bio?: string;
	createdAt?: Date;
	settings?: UserSettings;
};

declare module "next-auth" {
	interface Session {
		user: ExtendedUser;
	}
}
