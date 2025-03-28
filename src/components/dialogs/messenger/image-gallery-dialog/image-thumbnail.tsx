"use client";

import Image from "next/image";

import { cn } from "@/utils/general/cn";
import { PLACEHOLDER_CHAT_IMAGE } from "@/constants/media";

interface ImageThumbnailProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	imgUrl?: string;
	isActive?: boolean;
	className?: string;
}

const ImageThumbnail = ({ imgUrl, isActive, className, ...props }: ImageThumbnailProps) => (
	<button
		type="button"
		className={cn(
			"relative flex size-12 items-center justify-center overflow-hidden rounded-md border-2 border-transparent transition-all duration-300",
			"ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 dark:ring-offset-surface-dark-600 dark:focus-visible:ring-neutral-600",
			isActive && "border-primary-400",
			className
		)}
		{...props}
	>
		<Image
			src={imgUrl ?? PLACEHOLDER_CHAT_IMAGE}
			alt="thumbnail"
			fill
			sizes="(max-width: 640px) 10vw, (max-width: 1024px) 5vw, 48px"
			className="object-cover"
		/>
		<span className="sr-only">Image Thumbnail</span>
	</button>
);

export default ImageThumbnail;
