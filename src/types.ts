import type {
	User,
	FriendRequest,
	Friendship,
	Conversation,
	Message,
	TextMessage,
	ImageMessage,
	SystemMessage,
	MessageReaction,
	Member,
	Media,
	GroupDetails,
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

export type ConversationsFilterType = "all" | "group" | "unread";

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
	systemMessage: SystemMessage | null;
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

export interface RecentMessage extends Message {
	textMessage: TextMessage | null;
	imageMessage: ImageMessage | null;
	systemMessage: SystemMessage | null;
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

export interface GroupDetailsWithIcon extends GroupDetails {
	icon?: Media | null;
}

export interface ConversationWithMetadata extends Conversation {
	recentMessage: RecentMessage | null;
	unreadMessages: number;
	groupDetails: GroupDetailsWithIcon | null;
	participant: UserWithoutPassword | null;
}

export type SocialPlatform = "twitter" | "instagram" | "github";
export interface SocialLink {
	id: SocialPlatform;
	label: string;
	url: string | null;
}

export enum ChatAttachmentTypes {
	Image = "Image",
	Document = "Document",
}
interface ChatAttachmentUploadData {
	caption?: string;
}
export interface ChatDocumentAttachment extends ChatAttachmentUploadData {
	document: File;
}
export interface ChatImageAttachment extends ChatAttachmentUploadData {
	image: File;
}
export type ChatAttachmentUploadPayload =
	| { type: ChatAttachmentTypes.Document; data: ChatDocumentAttachment }
	| { type: ChatAttachmentTypes.Image; data: ChatImageAttachment[] };
