"use client";

import { useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";

import SiteLogo from "@/components/site-logo";

import Container from "@/app/(marketing)/_components/container";
import MobileMenu from "@/app/(marketing)/_components/header-navbar/mobile-menu";
import LoginOrAppLink from "@/app/(marketing)/_components/header-navbar/login-or-app-link";
import NavLinks, { type NavLink } from "@/app/(marketing)/_components/header-navbar/nav-links";

import { cn } from "@/utils/general/cn";
import { LOGO_FULL_LIGHT } from "@/constants/media";

interface HeaderNavbarProps {
	navLinks: NavLink[];
	className?: string;
}

const HeaderNavbar = ({ navLinks, className }: HeaderNavbarProps) => {
	const { scrollY } = useScroll();
	const [isBgTransparent, setIsBgTransparent] = useState(true);

	useMotionValueEvent(scrollY, "change", (y) => {
		setIsBgTransparent(y <= 50);
	});

	return (
		<div
			className={cn(
				"fixed left-0 top-0 z-50 h-16 w-full transition-shadow md:h-20",
				isBgTransparent ? "bg-transparent" : "bg-primary-400 shadow-lg",
				className
			)}
		>
			<Container className="flex h-full items-center justify-between">
				<SiteLogo
					src={LOGO_FULL_LIGHT}
					className="ring-offset-primary-400 focus-visible:ring-neutral-300 dark:ring-offset-primary-400"
				/>
				<nav className="hidden flex-1 px-5 sm:block lg:px-10">
					<NavLinks links={navLinks} scrollOffset={80} />
				</nav>
				<div className="hidden sm:block">
					<LoginOrAppLink />
				</div>
				<div className="pl-5 sm:hidden">
					<MobileMenu navLinks={navLinks} />
				</div>
			</Container>
		</div>
	);
};

export default HeaderNavbar;
