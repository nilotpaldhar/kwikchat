"use client";

import Image from "next/image";
import { XIcon } from "lucide-react";
import Skeleton from "@/components/ui/skeleton";

import { cn } from "@/utils/general/cn";

interface ImageThumbnailProps {
	imageURL: string | null;
	active?: boolean;
	className?: string;
	onClick?: () => void;
	onClose?: () => void;
}

const ImageThumbnail = ({
	imageURL,
	active = false,
	className,
	onClick = () => {},
	onClose = () => {},
}: ImageThumbnailProps) => (
	<div
		tabIndex={0}
		role="button"
		onClick={onClick}
		onKeyDown={(evt) => {
			if (evt.key === "Enter") onClick();
		}}
		className={cn(
			"group relative flex size-12 items-center justify-center overflow-hidden rounded-md border-2 border-transparent transition-all duration-300",
			active && "border-primary-400",
			"ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 dark:ring-offset-surface-dark-600 dark:focus-visible:ring-neutral-600",
			className
		)}
	>
		{imageURL ? (
			<Image src={imageURL} alt="thumbnail" fill className="object-cover" />
		) : (
			<Skeleton className="size-full" />
		)}
		<button
			type="button"
			onClick={(evt) => {
				evt.stopPropagation();
				onClose();
			}}
			className={cn(
				"absolute right-0 top-0 z-20 flex items-center justify-center rounded-sm p-0.5 text-neutral-200 opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100",
				"ring-offset-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200"
			)}
		>
			<XIcon size={12} />
		</button>
		<span className="absolute inset-0 z-10 block size-full bg-gradient-to-b from-neutral-900 to-transparent opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100" />
	</div>
);

export default ImageThumbnail;
