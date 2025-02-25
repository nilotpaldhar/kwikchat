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
		id: "faq-1",
		question: "How do I create an account?",
		answer: "Simply click on 'Sign Up', enter your details, and verify your email.",
	},
	{
		id: "faq-2",
		question: "Can I send images and files?",
		answer: "Yes, you can share images and documents in chat.",
	},
	{
		id: "faq-3",
		question: "Is there a dark mode available?",
		answer: "Yes, you can toggle between light and dark modes in settings.",
	},
	{
		id: "faq-4",
		question: "Can I delete messages after sending them?",
		answer: "Yes, you can delete messages for yourself or for everyone.",
	},
	{
		id: "faq-5",
		question: "Does this app support group chats?",
		answer: "Yes, you can create group chats.",
	},
	{
		id: "faq-6",
		question: "What happens if I forget my password?",
		answer: "You can reset your password using the 'Forgot Password' option on the login page.",
	},
] as const;
