import type { Metadata, Viewport } from "next";
import type { TemplateString } from "next/dist/lib/metadata/types/metadata-types";

// Define the base URL of the app
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// Define the name of the application
export const APP_NAME = "KwikChat";

// Define the title template for the app, using a dynamic string template with the app name
export const APP_TITLE: TemplateString = {
	template: `%s | ${APP_NAME}`,
	default: `Seamless Connections, Simplified Communication | ${APP_NAME}`,
};

// Define the description for the application, which will be used in meta tags and OpenGraph
export const APP_DESC =
	"Experience a modern messaging platform designed for effortless conversations and meaningful connections.";

// Define global metadata settings for the app, including SEO-related meta tags
export const GLOBAL_METADATA: Metadata = {
	title: APP_TITLE,
	description: APP_DESC,
	applicationName: APP_NAME,
	openGraph: {
		title: APP_TITLE,
		description: APP_DESC,
		url: APP_URL,
	},
	twitter: {
		title: APP_TITLE,
		description: APP_DESC,
		card: "summary_large_image",
	},
} as const;

// Define global viewport settings for the app
export const GLOBAL_VIEWPORT: Viewport = {
	colorScheme: "dark light",
	themeColor: "#27AE80",
} as const;
