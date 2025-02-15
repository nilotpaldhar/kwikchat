import HeaderSection from "@/app/(marketing)/_sections/header";
import FooterSection from "@/app/(marketing)/_sections/footer";

import { NAV_SECTIONS } from "@/constants/marketing";

const HomePage = () => (
	<div className="flex select-none flex-col bg-surface-light-100 text-neutral-900 dark:bg-surface-light-100 dark:text-neutral-900">
		<header id={NAV_SECTIONS.home.id} className="relative">
			<HeaderSection />
		</header>
		<main className="flex-1 py-36" />
		<footer>
			<FooterSection />
		</footer>
	</div>
);

export default HomePage;
