import type { User, FriendRequest, Friendship } from "@prisma/client";
import { PaginationMetadata } from "@/utils/general/calculate-pagination";

export interface UserProfile extends Omit<User, "password" | "image"> {}
export interface UserWithoutPassword extends Omit<User, "password"> {}

export enum AuthError {
	Configuration = "Configuration",
	AccessDenied = "AccessDenied",
	Verification = "Verification",
	Default = "Default",
}

export enum TokenValidationStatus {
	InvalidToken = "InvalidToken",
	TokenExpired = "TokenExpired",
	InvalidTokenEmail = "InvalidTokenEmail",
	ValidationFailed = "ValidationFailed",
	Default = "Default",
}

export type FriendsFilterType = "all" | "online" | "new";

export interface PaginatedResponse<T> {
	pagination: PaginationMetadata;
	items: T[];
}

export interface APIResponse<T> {
	status: boolean;
	message?: string;
	data?: T;
}

export interface BlockedUser {
	user: UserWithoutPassword;
	blockedAt: Date;
}

export interface FriendRequestWithRelations extends FriendRequest {
	sender: UserWithoutPassword;
	receiver: UserWithoutPassword;
}

export type FriendRequestType = "outgoing" | "incoming";
export interface FriendRequestWithRequestType extends FriendRequest {
	requestType: FriendRequestType;
	sender?: UserWithoutPassword;
	receiver?: UserWithoutPassword;
}

export interface FriendWithFriendship extends UserWithoutPassword {
	friendship: Friendship;
}
