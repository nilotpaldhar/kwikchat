import type { Config } from "tailwindcss";

const { fontFamily } = require("tailwindcss/defaultTheme");
const tailwindcssAnimate = require("tailwindcss-animate");
const tailwindScrollbar = require("tailwind-scrollbar");

const config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			screens: {
				xs: "430px",
				sm: "576px",
				md: "768px",
				lg: "992px",
				xl: "1200px",
				"2xl": "1400px",
				"3xl": "1800px",
				"hover-hover": { raw: "(hover: hover) and (pointer: fine)" },
				"hover-none": { raw: "(hover: none) and (pointer: none)" },
			},
			colors: {
				primary: {
					100: "#DCF7EE",
					200: "#97E8CD",
					300: "#51D8AB",
					400: "#27AE80",
					500: "#17684D",
					600: "#08231A",
				},
				"surface-light": {
					100: "#FFFFFF",
					200: "#F7F7F7",
					300: "#ECECEC",
					400: "#DFDFDF",
					500: "#D2D2D2",
					600: "#C6C6C6",
				},
				"surface-dark": {
					100: "#464646",
					200: "#393939",
					300: "#2D2D2D",
					400: "#202020",
					500: "#131313",
					600: "#060606",
				},
				"social-media": {
					twitter: "#14171a",
					instagram: "#405DE6",
					github: "#333333",
				},
			},
			boxShadow: {
				header: "0 4px 12px rgba(0, 0, 0, 0.06)",
				sidebar: "1px 0 24px rgba(0, 0, 0, 0.06)",
				"mobile-nav": "0 -4px 12px rgba(0, 0, 0, 0.06)",
			},
			fontFamily: {
				sans: ["var(--font-sans)", ...fontFamily.sans],
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"caret-blink": {
					"0%,70%,100%": { opacity: "1" },
					"20%,50%": { opacity: "0" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"caret-blink": "caret-blink 1.25s ease-out infinite",
			},
		},
	},
	plugins: [tailwindcssAnimate, tailwindScrollbar({ nocompatible: true })],
} satisfies Config;

export default config;
