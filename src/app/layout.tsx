import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

import type { Metadata } from "next";
import { Raleway as FontSans } from "next/font/google";

import ThemeProvider from "@/components/providers/theme-provider";
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
	const session = await auth();

	return (
		<SessionProvider session={session}>
			<html lang="en" suppressHydrationWarning>
				<body
					className={cn(
						"min-h-screen font-sans antialiased bg-surface-light-100 text-neutral-900 dark:bg-surface-dark-600 dark:text-neutral-200",
						fontSans.variable
					)}
				>
					<ThemeProvider
						attribute="class"
						defaultTheme="light"
						enableSystem
						storageKey="KwikChat-theme"
					>
						{children}
					</ThemeProvider>
				</body>
			</html>
		</SessionProvider>
	);
}

export default RootLayout;
