import HeaderSection from "@/app/(marketing)/_sections/header";
import { NAV_SECTIONS } from "@/constants/marketing";

const HomePage = () => (
	<div className="bg-surface-light-100 text-neutral-900 dark:bg-surface-light-100 dark:text-neutral-900">
		<header id={NAV_SECTIONS.home.id}>
			<HeaderSection />
		</header>
		<main className="py-36" />
	</div>
);

export default HomePage;
