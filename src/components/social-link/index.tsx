"use client";

import type { SocialPlatform } from "@/types";

import { Twitter, Instagram, GitHub } from "@/components/social-link/icons";

import { cn } from "@/utils/general/cn";
import openInNewTab from "@/utils/general/open-in-new-tab";

interface SocialLinkProps {
	platform: SocialPlatform;
	srText: string;
	url: string | null;
	className?: string;
}

const IconMap: Record<SocialPlatform, React.FC<React.SVGProps<SVGSVGElement>>> = {
	twitter: Twitter,
	instagram: Instagram,
	github: GitHub,
};

const SocialLink = ({ platform, srText, url, className }: SocialLinkProps) => {
	const Icon = IconMap[platform];

	return (
		<button
			type="button"
			className={cn(
				"flex size-7 items-center justify-center rounded-full fill-neutral-200 text-neutral-200 ring-offset-surface-dark-600 transition-opacity duration-150 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-700 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 md:size-8",
				platform === "twitter" && "bg-social-media-twitter",
				platform === "instagram" && "bg-social-media-instagram",
				platform === "github" && "bg-social-media-github",
				className
			)}
			disabled={url === null}
			onClick={() => openInNewTab(url)}
		>
			<Icon className="size-3" />
			<span className="sr-only">{srText}</span>
		</button>
	);
};

export default SocialLink;
