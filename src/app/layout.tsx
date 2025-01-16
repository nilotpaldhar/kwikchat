import type { Metadata, Viewport } from "next";
import { Raleway as FontSans } from "next/font/google";

import ThemeProvider from "@/components/providers/theme-provider";
import ToastProvider from "@/components/providers/toast-provider";
import TanstackQueryProvider from "@/components/providers/tanstack-query-provider";

import { cn } from "@/utils/general/cn";
import { GLOBAL_METADATA, GLOBAL_VIEWPORT } from "@/constants/seo";

import "@/styles/global.css";

// Initializing the Raleway font with specific subsets and variable name
const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
});

// Global metadata and viewport settings
export const metadata: Metadata = GLOBAL_METADATA;
export const viewport: Viewport = GLOBAL_VIEWPORT;

const RootLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => (
	<html lang="en" suppressHydrationWarning>
		<body
			className={cn(
				"min-h-screen bg-surface-light-100 font-sans text-neutral-900 antialiased dark:bg-surface-dark-600 dark:text-neutral-200",
				fontSans.variable
			)}
		>
			<TanstackQueryProvider>
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
					enableSystem
					storageKey="KwikChat-theme"
					disableTransitionOnChange
				>
					{children}
					<ToastProvider />
				</ThemeProvider>
			</TanstackQueryProvider>
		</body>
	</html>
);

export default RootLayout;
