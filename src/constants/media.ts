// Root folder for storing media files
export const ROOT_MEDIA_FOLDER = "kwikchat";

// Maximum file size limits for media uploads
export const MAX_AVATAR_SIZE = 400 * 1024; // 400 KB
export const MAX_GROUP_ICON_SIZE = 400 * 1024; // 400 KB
export const MAX_CHAT_DOCUMENT_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_CHAT_IMAGE_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Placeholder images used when users or groups don't have custom avatars
export const PLACEHOLDER_USER_IMAGE = "/placeholder/user.webp";
export const PLACEHOLDER_GROUP_IMAGE = "/placeholder/group.webp";

// Branding assets - Logos for different themes and use cases
export const LOGO_FULL = "/images/logos/full-logo.svg";
export const LOGO_ICON = "/images/logos/logo-icon.svg";
export const LOGO_FULL_LIGHT = "/images/logos/full-logo-light.svg";
export const LOGO_ICON_LIGHT = "/images/logos/logo-icon-light.svg";

// UI Images - Used in various sections of the app
export const CHAT_WELCOME_IMAGE = "/images/messenger/chat-welcome.webp"; // Shown on the messenger welcome screen

// Marketing Images - Used in promotional sections
export const APP_OVERVIEW_IMAGE = "/images/marketing/app-overview.webp";
export const HEADER_BG_IMAGE = "/images/marketing/header-bg.webp";
export const CTA_BG_IMAGE = "/images/marketing/cta-bg.webp";
export const CHAT_PREVIEW_GRID_IMAGE = "/images/marketing/chat-preview-grid.webp";

// Feature-specific images for marketing materials
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
