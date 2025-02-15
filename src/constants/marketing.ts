import type { SocialPlatform, SocialLink } from "@/types";

export const NAV_SECTIONS = {
	home: { id: "home", label: "Home" },
	features: { id: "features", label: "Features" },
	faqs: { id: "faqs", label: "FAQs" },
} as const;

const TWITTER_HANDLE = process.env.NEXT_PUBLIC_TWITTER_HANDLE ?? null;
const INSTAGRAM_HANDLE = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE ?? null;
const GITHUB_HANDLE = process.env.NEXT_PUBLIC_GITHUB_HANDLE ?? null;
const SOCIAL_HANDLES = {
	twitter: TWITTER_HANDLE && `https://twitter.com/${TWITTER_HANDLE}`,
	instagram: INSTAGRAM_HANDLE && `https://instagram.com/${INSTAGRAM_HANDLE}`,
	github: GITHUB_HANDLE && `https://github.com/${GITHUB_HANDLE}`,
} as const;

export const SOCIAL_MEDIA_LINKS: Record<string, SocialLink> = Object.entries(SOCIAL_HANDLES)
	.filter(([, url]) => url)
	.reduce<Record<string, SocialLink>>((acc, [platform, url]) => {
		acc[platform] = {
			id: platform as SocialPlatform,
			label: platform.charAt(0).toUpperCase() + platform.slice(1),
			url,
		};
		return acc;
	}, {});

export const DEVELOPER_LINKS = {
	about: {
		id: "about-dev",
		label: "About Me",
		url: process.env.NEXT_PUBLIC_ABOUT_ME_URL ?? null,
	},
	portfolio: {
		id: "portfolio-dev",
		label: "Portfolio",
		url: process.env.NEXT_PUBLIC_PORTFOLIO_URL ?? null,
	},
	contact: {
		id: "contact-dev",
		label: "Contact Me",
		url: process.env.NEXT_PUBLIC_CONTACT_ME_URL ?? null,
	},
} as const;
