"use client";

import Link from "next/link";
import { cn } from "@/utils/general/cn";
import { NAV_SECTIONS } from "@/constants/marketing";

export type NavLink = (typeof NAV_SECTIONS)[keyof typeof NAV_SECTIONS];

interface NavLinksProps {
	links: NavLink[];
	className?: string;
	linkClassName?: string;
	onLinkClick?: () => void;
}

const NavLinks = ({ links, className, linkClassName, onLinkClick = () => {} }: NavLinksProps) => (
	<ul className={cn("flex items-center justify-center space-x-6 lg:space-x-10", className)}>
		{links.map(({ id, label }) => (
			<li key={id}>
				<Link
					href={"/#" + id}
					onClick={onLinkClick}
					className={cn(
						"block rounded-sm text-base font-semibold leading-none text-white ring-offset-primary-400 after:block after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:transform after:rounded-full after:bg-white after:transition-transform after:duration-150 hover:after:scale-x-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-4",
						linkClassName
					)}
				>
					{label}
				</Link>
			</li>
		))}
	</ul>
);
export default NavLinks;
