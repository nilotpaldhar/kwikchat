import HeaderSection from "@/app/(marketing)/_sections/header";
import FeaturesSection from "@/app/(marketing)/_sections/features";
import FAQSection from "@/app/(marketing)/_sections/faq";
import CTASection from "@/app/(marketing)/_sections/cta";
import FooterSection from "@/app/(marketing)/_sections/footer";

import { NAV_SECTIONS } from "@/constants/marketing";

const HomePage = () => (
	<div className="flex select-none flex-col bg-surface-light-100 text-neutral-900 dark:bg-surface-light-100 dark:text-neutral-900">
		<header id={NAV_SECTIONS.home.id} className="relative">
			<HeaderSection />
		</header>
		<main className="flex-1 py-16 md:py-20">
			<section id={NAV_SECTIONS.features.id} className="py-16 md:pb-20 lg:pb-24">
				<FeaturesSection />
			</section>
			<section
				id={NAV_SECTIONS.faqs.id}
				className="pb-12 pt-16 md:pb-16 md:pt-20 lg:pb-20 lg:pt-24"
			>
				<FAQSection />
			</section>
			<section className="pt-12 md:pt-16 lg:pt-20">
				<CTASection />
			</section>
		</main>
		<footer>
			<FooterSection />
		</footer>
	</div>
);

export default HomePage;
