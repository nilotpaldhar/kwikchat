import Container from "@/app/(marketing)/_components/container";
import HeaderNavbar from "@/app/(marketing)/_components/header-navbar";
import TryNowButton from "@/app/(marketing)/_components/try-now-button";
import ExploreCodeButton from "@/app/(marketing)/_components/explore-code-button";

import HeroImage from "@/app/(marketing)/_sections/header/hero-image";

import { NAV_SECTIONS } from "@/constants/marketing";

const HeaderSection = () => (
	<div className="w-full bg-primary-400 text-white">
		<HeaderNavbar navLinks={Object.values(NAV_SECTIONS)} />
		<div className="pt-20 md:pt-24">
			<Container>
				<div className="flex flex-col space-y-4 xl:flex-row xl:space-y-0">
					<div className="flex-1">
						<h1 className="flex flex-col space-y-3 text-center text-3xl font-normal !leading-none tracking-[2px] sm:whitespace-nowrap sm:text-4xl sm:tracking-[4px] md:text-5xl lg:text-6xl xl:space-y-5 xl:text-left xl:text-7xl">
							<span>Get the best</span>
							<span>
								<strong className="font-extrabold">experience</strong> when
							</span>
							<span>sending messages.</span>
						</h1>
					</div>
					<div className="flex flex-1 flex-col items-center xl:items-end">
						<p className="max-w-xs text-center text-base font-medium sm:max-w-md md:max-w-md md:text-xl xl:flex xl:flex-col xl:space-y-3 xl:text-left xl:leading-none">
							<span>Platform used to send messages a myriad of</span>
							<span>features, by prioritizing the user experience</span>
						</p>
						<div className="flex w-full max-w-xs flex-col space-y-4 pt-8 sm:max-w-max sm:flex-row sm:space-x-2 sm:space-y-0 md:space-x-4 md:pt-10">
							<TryNowButton />
							<ExploreCodeButton />
						</div>
					</div>
				</div>
			</Container>
			<div className="pt-12 sm:pt-16 md:pt-20 xl:pt-24">
				<HeroImage />
			</div>
		</div>
	</div>
);

export default HeaderSection;
