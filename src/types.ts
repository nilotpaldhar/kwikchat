import type { User } from "@prisma/client";
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
