import { SunMoon } from "lucide-react";

import SiteLogo from "@/components/site-logo";
import { Button } from "@/components/ui/button";

import DesktopNav from "@/app/messenger/_components/desktop-nav";
import ProfilePopup from "@/app/messenger/_components/profile-popup";
import ThemeToggle from "@/app/messenger/_components/theme-toggle";

import { LOGO_ICON } from "@/constants/media";

const DesktopSidebar = () => (
	<div className="flex h-full flex-col items-center">
		<div className="flex size-16 items-center justify-center">
			<SiteLogo href="/messenger" src={LOGO_ICON} width={40} height={40} />
		</div>
		<nav className="w-full flex-1 py-8">
			<DesktopNav />
		</nav>
		<div className="flex w-full flex-col items-center space-y-6 py-6">
			<ThemeToggle>
				<Button
					size="icon"
					className="h-12 w-12 bg-transparent text-neutral-700 hover:bg-transparent hover:text-primary-400 dark:text-neutral-300"
				>
					<SunMoon size={20} />
					<span className="sr-only">Toggle Theme</span>
				</Button>
			</ThemeToggle>
			<ProfilePopup />
		</div>
	</div>
);

export default DesktopSidebar;
