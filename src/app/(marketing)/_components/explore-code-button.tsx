"use client";

import { CodeXml } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";

import { cn } from "@/utils/general/cn";
import openInNewTab from "@/utils/general/open-in-new-tab";

const SOURCE_CODE_URL = process.env.NEXT_PUBLIC_GITHUB_REPO_URL ?? null;

const ExploreCodeButton = ({ className, ...props }: ButtonProps) => (
	<Button
		onClick={() => openInNewTab(SOURCE_CODE_URL)}
		className={cn(
			"h-11 space-x-2 rounded-full border-2 border-white px-6 py-4 ring-offset-primary-400 hover:bg-white hover:text-primary-400 focus-visible:ring-neutral-300 dark:ring-offset-primary-400 md:h-12 xl:h-14",
			className
		)}
		{...props}
	>
		<CodeXml size={16} />
		<span className="text-base font-semibold">Explore the Code</span>
	</Button>
);

export default ExploreCodeButton;
