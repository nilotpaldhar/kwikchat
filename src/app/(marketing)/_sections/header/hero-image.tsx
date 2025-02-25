import Image from "next/image";
import Container from "@/app/(marketing)/_components/container";

import { APP_OVERVIEW_IMAGE } from "@/constants/media";

const HeroImage = () => (
	<div className="relative">
		<Container>
			<div className="relative z-10 w-full overflow-hidden" style={{ aspectRatio: "4 / 3" }}>
				<Image
					src={APP_OVERVIEW_IMAGE}
					alt="App Overview"
					fill
					priority
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1400px"
					className="rounded-2xl border-4 border-neutral-200 object-cover"
				/>
			</div>
		</Container>
		<div className="absolute bottom-0 h-2/4 w-full bg-white" />
	</div>
);

export default HeroImage;
