// The root folder for media storage
export const ROOT_MEDIA_FOLDER = "kwikchat";

// The maximum allowed size for avatar uploads
export const MAX_AVATAR_SIZE = 400 * 1024; // 400 KB

// The maximum allowed size for group icon uploads
export const MAX_GROUP_ICON_SIZE = 400 * 1024; // 400 KB

// Placeholder images for users and groups
export const PLACEHOLDER_USER_IMAGE = "/placeholder/user.webp";
export const PLACEHOLDER_GROUP_IMAGE = "/placeholder/group.webp";

// Logo assets for branding
export const LOGO_FULL = "/images/logos/full-logo.svg";
export const LOGO_ICON = "/images/logos/logo-icon.svg";
export const LOGO_FULL_LIGHT = "/images/logos/full-logo-light.svg";
export const LOGO_ICON_LIGHT = "/images/logos/logo-icon-light.svg";

// Default image shown on the messenger welcome screen
export const CHAT_WELCOME_IMAGE = "/images/messenger/chat-welcome.webp";

export const APP_OVERVIEW_IMAGE = "/images/marketing/app-overview.webp";
export const HEADER_BG_IMAGE = "/images/marketing/header-bg.webp";
export const APP_FEATURE_IMAGES = {
	realTimeChat: {
		src: "/images/marketing/features/real-time-chat.webp",
		alt: "Real-time chat interface with instant message delivery",
		width: 550,
		height: 600,
	},
	richChatExperience: {
		src: "/images/marketing/features/real-time-chat.webp",
		alt: "Feature-rich chat with multimedia sharing and message reactions",
		width: 550,
		height: 600,
	},
	secureMessaging: {
		src: "/images/marketing/features/real-time-chat.webp",
		alt: "Private and secure chat ensuring message confidentiality",
		width: 550,
		height: 600,
	},
} as const;
