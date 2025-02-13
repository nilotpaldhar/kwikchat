export const NAV_SECTIONS = {
	home: { id: "home", label: "Home" },
	features: { id: "features", label: "Features" },
	faqs: { id: "faqs", label: "FAQs" },
} as const;

const TWITTER_HANDLE = process.env.NEXT_PUBLIC_TWITTER_HANDLE ?? null;
const INSTAGRAM_HANDLE = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE ?? null;
const GITHUB_HANDLE = process.env.NEXT_PUBLIC_GITHUB_HANDLE ?? null;
export const SOCIAL_MEDIA_LINKS = {
	twitter: {
		id: "twitter",
		label: "Twitter",
		url: TWITTER_HANDLE ? `https://twitter.com/${TWITTER_HANDLE}` : null,
	},
	instagram: {
		id: "instagram",
		label: "Instagram",
		url: INSTAGRAM_HANDLE ? `https://instagram.com/${INSTAGRAM_HANDLE}` : null,
	},
	github: {
		id: "github",
		label: "Github",
		url: GITHUB_HANDLE ? `https://github.com/${GITHUB_HANDLE}` : null,
	},
} as const;
