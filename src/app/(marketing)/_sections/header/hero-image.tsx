import Image from "next/image";
import Container from "@/app/(marketing)/_components/container";

import { APP_PREVIEW_IMAGE } from "@/constants/media";

const HeroImage = () => (
	<div className="relative">
		<Container>
			<div className="relative z-10 w-full overflow-hidden" style={{ aspectRatio: "5 / 3" }}>
				<div
					className="absolute inset-0 z-10 rounded-2xl bg-gradient-to-b from-transparent from-60% to-white"
					style={{ aspectRatio: "5 / 3" }}
				></div>
				<Image
					src={APP_PREVIEW_IMAGE}
					alt="Minimalist chat interface with intuitive layout and light theme"
					fill
					priority
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
					className="rounded-2xl border-8 border-neutral-200 object-cover"
				/>
			</div>
		</Container>
		<div className="absolute bottom-0 h-2/4 w-full bg-white" />
	</div>
);

export default HeroImage;
