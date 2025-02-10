import type { Metadata } from "next";

import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
	title: "404 Not Found",
	description:
		"Lost in cyberspace? The page you're looking for isn't here. It may have been moved, deleted, or never existed. Head back to our homepage",
};

const GlobalNotFound = () => (
	<div className="flex min-h-screen items-center px-10 py-10">
		<div className="flex w-full flex-1 select-none flex-col items-center justify-center text-center">
			<div className="relative sm:py-6">
				<h1 className="text-3xl font-extrabold uppercase leading-tight tracking-[4px] text-neutral-900 dark:text-neutral-200 sm:whitespace-nowrap sm:text-5xl sm:leading-none lg:text-7xl">
					Page Not Found
				</h1>
				<div className="absolute -left-5 top-[46px] hidden rounded bg-primary-400 px-2 py-0.5 text-white sm:block lg:-left-8 lg:top-[60px]">
					<span className="block text-xs font-semibold leading-none tracking-normal lg:text-base lg:leading-none lg:tracking-[2px]">
						Error 404
					</span>
				</div>
				<span className="absolute -left-7 top-0 hidden h-0.5 w-14 rounded-full bg-neutral-900 dark:bg-neutral-200 sm:-left-10 sm:block sm:w-20" />
				<span className="absolute -right-7 bottom-0 hidden h-0.5 w-14 rounded-full bg-neutral-900 dark:bg-neutral-200 sm:-right-10 sm:block sm:w-20" />
			</div>
			<div className="max-w-lg py-5 sm:py-8">
				<p className="text-sm font-medium leading-7 text-neutral-900 dark:text-neutral-200 sm:text-base sm:leading-7">
					The page you were looking for could not be found. It might have been removed, renamed, or
					did not exist in the first place.
				</p>
			</div>
			<div>
				<Button asChild className="h-auto space-x-2 px-6 py-3 lg:space-x-3 lg:px-8 lg:py-4">
					<Link href="/">
						<Home className="size-4 lg:size-5" />
						<span className="text-base font-medium lg:text-lg">Back to Home</span>
					</Link>
				</Button>
			</div>
		</div>
	</div>
);

export default GlobalNotFound;
