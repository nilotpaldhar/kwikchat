import type { SocialPlatform, SocialLink } from "@/types";

// Navigation sections for the landing/marketing page
export const NAV_SECTIONS = {
	home: { id: "home", label: "Home" },
	features: { id: "features", label: "Features" },
	faqs: { id: "faqs", label: "FAQs" },
} as const;

// Fetch social media handles from environment variables
const TWITTER_HANDLE = process.env.NEXT_PUBLIC_TWITTER_HANDLE ?? null;
const INSTAGRAM_HANDLE = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE ?? null;
const GITHUB_HANDLE = process.env.NEXT_PUBLIC_GITHUB_HANDLE ?? null;

// Construct social media links dynamically based on available handles
const SOCIAL_HANDLES = {
	twitter: TWITTER_HANDLE && `https://twitter.com/${TWITTER_HANDLE}`,
	instagram: INSTAGRAM_HANDLE && `https://instagram.com/${INSTAGRAM_HANDLE}`,
	github: GITHUB_HANDLE && `https://github.com/${GITHUB_HANDLE}`,
} as const;

// Generate a list of social media links, filtering out any null values
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

// Developer-related links, fetched from environment variables
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

// Frequently Asked Questions (FAQs) for the app
export const FAQS = [
	{
		id: "faq-tech",
		question: "What technologies power this app?",
		answer:
			"Built with Next.js, React, Tailwind CSS, and Shadcn, it uses PostgreSQL, Prisma, Pusher, and ImageKit. It's deployed on Vercel for modern, edge-first performance.",
	},
	{
		id: "faq-pusher",
		question: "Why are you using Pusher instead of raw WebSockets?",
		answer:
			"Because Vercel doesn't support native WebSocket connections. Pusher offers real-time capabilities that work seamlessly in a serverless deployment.",
	},
	{
		id: "faq-realtime",
		question: "Is messaging real-time?",
		answer:
			"Yes — messages are updated live via Pusher, and the interface feels instant thanks to TanStack Query's optimistic updates.",
	},
	{
		id: "faq-files",
		question: "Can I share files or images in chat?",
		answer:
			"Yes. You can upload images and documents. The app also provides instant previews before upload for a smooth sharing experience.",
	},
	{
		id: "faq-groups",
		question: "Can I create group chats?",
		answer:
			"Absolutely. You can create group chats, manage participants dynamically, react to messages, and star important ones for later.",
	},
	{
		id: "faq-darkmode",
		question: "Is dark mode available?",
		answer:
			"Yes. The app supports light and dark themes out of the box, with clean, accessible styling via Shadcn UI.",
	},
] as const;
