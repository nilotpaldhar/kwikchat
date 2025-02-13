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

const HeaderNavbar = ({ navLinks, className }: HeaderNavbarProps) => (
	<div className={cn("h-16 bg-transparent md:h-20", className)}>
		<Container className="flex h-full items-center justify-between">
			<SiteLogo
				src={LOGO_FULL_LIGHT}
				className="ring-offset-primary-400 focus-visible:ring-neutral-300 dark:ring-offset-primary-400"
			/>
			<nav className="hidden flex-1 px-5 sm:block lg:px-10">
				<NavLinks links={navLinks} />
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

export default HeaderNavbar;
