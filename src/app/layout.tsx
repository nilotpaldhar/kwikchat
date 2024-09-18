import type { Metadata } from "next";
import { Raleway as FontSans } from "next/font/google";

import ThemeProvider from "@/components/providers/theme-provider";
import ToastProvider from "@/components/providers/toast-provider";
import TanstackQueryProvider from "@/components/providers/tanstack-query-provider";

import { cn } from "@/utils/general/cn";

import "@/styles/global.css";

const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
});

export const metadata: Metadata = {
	title: "KwikChat",
	description: "Messenger App",
};

async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
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
}

export default RootLayout;
