"use client";

import { Image } from "lucide-react";
import { cn } from "@/utils/general/cn";

interface ChatMessageImageProps {
	isSender: boolean;
	className?: string;
}

const ChatMessageImage = ({ isSender, className }: ChatMessageImageProps) => (
	<div
		className={cn(
			"h-56 w-56 rounded-2xl",
			isSender
				? "rounded-tr-none bg-primary-400 text-neutral-50"
				: "rounded-tl-none bg-surface-light-100 dark:bg-surface-dark-400",
			className
		)}
	>
		<div className={cn("flex h-full items-center justify-center")}>
			<Image size={40} />
		</div>
	</div>
);

export default ChatMessageImage;
