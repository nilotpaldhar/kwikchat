import Image from "next/image";
import { cn } from "@/utils/general/cn";

const FeatureBlock = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
	<section
		className={cn(
			"flex flex-col gap-y-12 md:gap-y-14 lg:flex-row lg:gap-x-10 lg:gap-y-0 xl:gap-x-0",
			className
		)}
		{...props}
	/>
);
FeatureBlock.displayName = "FeatureBlock";

interface FeatureBlockImageProps {
	src: string;
	alt: string;
	width: number;
	height: number;
	className?: string;
	classNames?: {
		image?: string;
		imageBackground?: string;
		imageContainer?: string;
	};
}
const FeatureBlockImage = ({
	src,
	alt,
	width,
	height,
	className,
	classNames,
}: FeatureBlockImageProps) => (
	<div
		className={cn(
			"flex w-full justify-center md:justify-start lg:max-w-xl xl:max-w-[700px]",
			className
		)}
	>
		<div
			className={cn(
				"w-full overflow-hidden rounded-xl bg-neutral-100 px-5 pt-5 md:px-10 md:pt-10 lg:w-auto lg:pl-0",
				classNames?.imageBackground
			)}
		>
			<div
				className={cn(
					"flex justify-center overflow-hidden rounded-xl rounded-b-none lg:block lg:rounded-l-none",
					classNames?.imageContainer
				)}
			>
				<Image src={src} alt={alt} width={width} height={height} className={classNames?.image} />
			</div>
		</div>
	</div>
);
FeatureBlockImage.displayName = "FeatureBlockImage";

const FeatureBlockContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={cn("flex max-w-2xl flex-1 items-center", className)} {...props} />
);
FeatureBlockContent.displayName = "FeatureBlockContent";

export { FeatureBlock, FeatureBlockImage, FeatureBlockContent };
