import Image from "next/image";
import { HEADER_BG_IMAGE } from "@/constants/media";

const HeaderOverlay = () => (
	<div className="absolute top-0 w-full overflow-hidden" style={{ aspectRatio: "4 / 3" }}>
		<Image
			src={HEADER_BG_IMAGE}
			alt="Header Background"
			fill
			priority
			sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1400px"
			className="object-cover"
		/>
	</div>
);
export default HeaderOverlay;
