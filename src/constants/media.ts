// Root folder for storing media files
export const ROOT_MEDIA_FOLDER = "kwikchat";

// Maximum file size limits for media uploads
export const MAX_AVATAR_SIZE = 400 * 1024; // 400 KB
export const MAX_GROUP_ICON_SIZE = 400 * 1024; // 400 KB
export const MAX_CHAT_DOCUMENT_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_CHAT_IMAGE_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Placeholder images used when no custom image is available
export const PLACEHOLDER_USER_IMAGE = "/placeholder/user.webp";
export const PLACEHOLDER_GROUP_IMAGE = "/placeholder/group.webp";
export const PLACEHOLDER_CHAT_IMAGE = "/placeholder/chat-image.webp";

// Branding assets - Logos for different themes and use cases
export const LOGO_FULL = "/images/logos/full-logo.svg";
export const LOGO_ICON = "/images/logos/logo-icon.svg";
export const LOGO_FULL_LIGHT = "/images/logos/full-logo-light.svg";
export const LOGO_ICON_LIGHT = "/images/logos/logo-icon-light.svg";

// UI Images - Used in various sections of the app
export const CHAT_WELCOME_IMAGE = "/images/messenger/chat-welcome.webp"; // Shown on the messenger welcome screen

// Marketing Images - Used in promotional sections
export const APP_PREVIEW_IMAGE = "/images/marketing/app-preview.webp";
export const HEADER_BG_IMAGE = "/images/marketing/header-bg.webp";
export const CTA_BG_IMAGE = "/images/marketing/cta-bg.webp";
export const CHAT_PREVIEW_GRID_IMAGE = "/images/marketing/chat-preview-grid.webp";

// Feature-specific images for marketing materials
export const APP_FEATURE_IMAGES = {
	realTimeChat: {
		src: "/images/marketing/features/real-time-chat.webp",
		alt: "Screenshot of the real-time chat interface in the app",
		width: 550,
		height: 600,
	},
	secureMessaging: {
		src: "/images/marketing/features/account-security.webp",
		alt: "Screenshot of the account security and secure messaging settings",
		width: 550,
		height: 600,
	},
	richChatExperience: {
		src: "/images/marketing/features/chat-preview-dark-light-mode.webp",
		alt: "Screenshot of the chat interface in both dark and light modes",
		width: 550,
		height: 600,
	},
} as const;
