import HeaderSection from "@/app/(marketing)/_sections/header";
import FooterSection from "@/app/(marketing)/_sections/footer";
import FAQSection from "@/app/(marketing)/_sections/faq";
import FeaturesSection from "@/app/(marketing)/_sections/features";

import { NAV_SECTIONS } from "@/constants/marketing";

const HomePage = () => (
	<div className="flex select-none flex-col bg-surface-light-100 text-neutral-900 dark:bg-surface-light-100 dark:text-neutral-900">
		<header id={NAV_SECTIONS.home.id} className="relative">
			<HeaderSection />
		</header>
		<main className="flex-1 py-16 md:py-20">
			<section id={NAV_SECTIONS.features.id} className="pb-16 pt-16 md:pb-20 lg:pb-24">
				<FeaturesSection />
			</section>
			<section
				id={NAV_SECTIONS.faqs.id}
				className="pb-12 pt-16 md:pb-16 md:pt-20 lg:pb-20 lg:pt-24"
			>
				<FAQSection />
			</section>
		</main>
		<footer>
			<FooterSection />
		</footer>
	</div>
);

export default HomePage;
