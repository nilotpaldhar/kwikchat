"use client";

import { Button } from "@/components/ui/button";

import { APP_URL } from "@/constants/seo";

import { cn } from "@/utils/general/cn";
import openInNewTab from "@/utils/general/open-in-new-tab";

import useCurrentUser from "@/hooks/tanstack-query/use-current-user";

interface LoginOrAppLinkProps {
	defaultClassNames?: boolean;
	className?: string;
}

const LoginOrAppLink = ({ defaultClassNames = true, className }: LoginOrAppLinkProps) => {
	const { data, isLoading } = useCurrentUser();
	const userId = data?.data?.id ?? null;
	const url = userId ? `${APP_URL}/messenger` : `${APP_URL}/sign-in`;

	return (
		<Button
			disabled={isLoading}
			onClick={() => openInNewTab(url)}
			className={cn(
				defaultClassNames &&
					"min-w-28 space-x-2 rounded-full bg-white px-8 py-2 font-bold text-primary-400 ring-offset-primary-400 hover:bg-white hover:text-primary-400 focus-visible:ring-neutral-300 disabled:opacity-80 dark:ring-offset-primary-400 lg:min-w-36",
				className
			)}
		>
			<span>{userId ? "Open App" : "Login"}</span>
		</Button>
	);
};

export default LoginOrAppLink;

// 	<a href="/messenger">Open App</a>
// <a href="/sign-in">Login</a>
