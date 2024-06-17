import { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
	displayName?: string;
	username?: string;
	bio?: string;
	createdAt?: Date;
};

declare module "next-auth" {
	interface Session {
		user: ExtendedUser;
	}
}
