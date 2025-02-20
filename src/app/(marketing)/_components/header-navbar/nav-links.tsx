"use client";

import SmoothScrollLink from "@/components/smooth-scroll-link";

import { cn } from "@/utils/general/cn";
import { NAV_SECTIONS } from "@/constants/marketing";

export type NavLink = (typeof NAV_SECTIONS)[keyof typeof NAV_SECTIONS];

interface NavLinksProps {
	links: NavLink[];
	scrollOffset?: number;
	className?: string;
	linkClassName?: string;
	onScrollComplete?: () => void;
}

const NavLinks = ({
	links,
	scrollOffset,
	className,
	linkClassName,
	onScrollComplete = () => {},
}: NavLinksProps) => (
	<ul className={cn("flex items-center justify-center space-x-6 lg:space-x-10", className)}>
		{links.map(({ id, label }) => (
			<li key={id}>
				<SmoothScrollLink
					href={`#${id}`}
					offset={scrollOffset}
					onScrollComplete={onScrollComplete}
					className={cn(
						"block rounded-sm text-base font-semibold leading-none text-white ring-offset-primary-400 after:block after:h-0.5 after:w-0 after:rounded-full after:bg-white after:transition-all after:duration-150 hover:after:w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-4",
						linkClassName
					)}
				>
					{label}
				</SmoothScrollLink>
			</li>
		))}
	</ul>
);
export default NavLinks;
