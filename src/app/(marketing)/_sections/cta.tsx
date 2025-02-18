import Image from "next/image";
import Container from "@/app/(marketing)/_components/container";
import TryNowButton from "@/app/(marketing)/_components/try-now-button";

import { CHAT_PREVIEW_GRID_IMAGE, CTA_BG_IMAGE } from "@/constants/media";

const CTASection = () => (
	<div>
		<Container>
			<div className="relative overflow-hidden rounded-2xl bg-primary-400 text-white md:rounded-3xl">
				<div className="relative z-10 flex flex-col px-5 pb-10 pt-14 md:px-10 md:pt-16 xl:flex-row xl:p-20 xl:pr-0">
					<div className="flex-1">
						<h2 className="flex flex-col space-y-3 text-center text-2xl font-normal leading-none tracking-[2px] sm:whitespace-nowrap sm:text-4xl md:text-5xl xl:text-left">
							<span>Experience Seamless</span>
							<span>communication!</span>
						</h2>
						<p className="mx-auto max-w-lg pt-4 text-center text-sm font-medium sm:text-base md:pt-8 md:text-xl xl:flex xl:flex-col xl:space-y-3 xl:whitespace-nowrap xl:text-left xl:leading-none">
							<span>Redefine connection with seamless communication.</span>
							<span>Elevate your conversation, transcend boundaries.</span>
						</p>
						<div className="flex justify-center pt-4 md:pt-8 xl:justify-start">
							<TryNowButton className="h-10 w-full max-w-xs md:h-12 xl:max-w-max" />
						</div>
					</div>
					<div className="hidden xl:flex xl:items-center">
						<div className="flex translate-x-16 transform justify-end">
							<Image src={CHAT_PREVIEW_GRID_IMAGE} alt="Chat Preview" width={792} height={300} />
						</div>
					</div>
				</div>
				<div
					className="absolute top-0 hidden w-full overflow-hidden sm:block"
					style={{ aspectRatio: "60 / 23" }}
				>
					<Image src={CTA_BG_IMAGE} alt="CTA Background" fill priority className="object-cover" />
				</div>
			</div>
		</Container>
	</div>
);

export default CTASection;
