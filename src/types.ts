import type {
	User,
	FriendRequest,
	Friendship,
	Conversation,
	Message,
	TextMessage,
	ImageMessage,
	SystemMessage,
	DocumentMessage,
	MessageReaction,
	Member,
	Media,
	GroupDetails,
	FileType,
} from "@prisma/client";
import type { Area, Point } from "react-easy-crop";
import type { FileDetails } from "@/utils/general/file";
import type { PaginationMetadata } from "@/utils/general/calculate-pagination";

export type UserProfile = Omit<User, "password" | "image">;
export type UserWithoutPassword = Omit<User, "password">;
export type MediaWithoutId = Omit<Media, "id">;

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

export type MediaAttachmentFilterType = "all" | FileType;

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
	imageMessage: ImageMessage[];
	systemMessage: SystemMessage | null;
	documentMessage: DocumentMessage | null;
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
	imageMessage: ImageMessage[];
	documentMessage: DocumentMessage | null;
	systemMessage: SystemMessage | null;
}

export interface ImageMessageWithMedia extends ImageMessage {
	media?: Media;
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

export interface ImageUpload {
	id: string;
	image: File;
	imageUrl: string | null;
	caption?: string;
	crop: Point;
	zoom: number;
	cropPixels: Area | null;
}

export enum ChatAttachmentTypes {
	Image = "Image",
	Document = "Document",
}

export interface ChatDocumentAttachment {
	caption?: string;
	document: FileDetails;
	documentDataUrl: string | null;
}

export interface ChatImageAttachment {
	caption?: string;
	image: FileDetails;
	imageDataUrl: string | null;
}
