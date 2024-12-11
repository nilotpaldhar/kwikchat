import type {
	User,
	FriendRequest,
	Friendship,
	Conversation,
	Message,
	TextMessage,
	ImageMessage,
	MessageReaction,
	Member,
	Media,
} from "@prisma/client";
import { PaginationMetadata } from "@/utils/general/calculate-pagination";

export interface UserProfile extends Omit<User, "password" | "image"> {}
export interface UserWithoutPassword extends Omit<User, "password"> {}
export interface MediaWithoutId extends Omit<Media, "id"> {}

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

export interface ConversationWithMembers extends Conversation {
	members: Member[];
}

export interface CompleteMessage extends Message {
	conversation: Conversation;
	textMessage: TextMessage | null;
	imageMessage: ImageMessage | null;
	seenByMembers: string[];
	sender: UserProfile;
	reactions: MessageReaction[];
	isStarred: boolean;
}

export interface MessageSeenMembers {
	messageId: string;
	seenByMembers: string[];
}

export interface MessageWithUserID extends Message {
	conversation: Conversation & {
		members: { userId: string }[];
	};
}

export interface GroupOverview {
	id: string;
	name: string;
	description?: string | null;
	icon?: string | null;
	bannerColor?: string | null;
	createdAt: Date;
	creator: UserWithoutPassword;
	members: {
		total: number;
		online: number;
	};
}

export interface GroupMember extends Member {
	user: UserWithoutPassword;
}

export interface GroupConversationWithMembers extends Conversation {
	members: GroupMember[];
}
