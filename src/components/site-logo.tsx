import Link from "next/link";
import Image from "next/image";
import { cn } from "@/utils/general/cn";

interface SiteLogoProps {
	src?: string;
	href?: string;
	alt?: string;
	width?: number;
	height?: number;
	className?: string;
}

const SiteLogo: React.FC<SiteLogoProps> = ({
	src = "/images/logo.svg",
	href = "/",
	alt = "KwikChat",
	width = 140,
	height = 28,
	className = "",
}) => (
	<Link
		href={href}
		className={cn(
			"rounded-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-8 focus-visible:ring-primary-300 dark:ring-offset-surface-dark-600",
			className
		)}
	>
		<Image src={src} alt={alt} width={width} height={height} />
	</Link>
);

export default SiteLogo;
