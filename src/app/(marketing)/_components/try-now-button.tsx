"use client";

import { Rocket } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";

import { APP_URL } from "@/constants/seo";
import openInNewTab from "@/utils/general/open-in-new-tab";
import { cn } from "@/utils/general/cn";

interface TryNowButtonProps extends ButtonProps {
	bgVariant?: "primary" | "white";
	iconSize?: number;
}

const TryNowButton = ({
	bgVariant = "white",
	iconSize = 16,
	className,
	...props
}: TryNowButtonProps) => (
	<Button
		className={cn(
			"h-11 space-x-2 rounded-full border-2 border-transparent px-6 py-4 text-base font-semibold md:h-12 xl:h-14",
			bgVariant === "white" &&
				"bg-white text-primary-400 ring-offset-primary-400 hover:bg-white hover:text-primary-400 focus-visible:ring-neutral-300 dark:ring-offset-primary-400",
			className
		)}
		onClick={() => openInNewTab(`${APP_URL}/messenger`)}
		{...props}
	>
		<Rocket size={iconSize} />
		<span>Try It Now</span>
	</Button>
);

export default TryNowButton;
