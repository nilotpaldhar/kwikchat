"use client";

import type { EmojiClickData } from "emoji-picker-react";

import { Smile } from "lucide-react";

import { Button } from "@/components/ui/button";
import EmojiPicker from "@/components/ui/emoji-picker";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

import { cn } from "@/utils/general/cn";

interface EmojiButtonProps {
	onSelect?: (emoji: string) => void;
	className?: string;
}

const EMOJI_PICKER_WIDTH = 280;
const EMOJI_PICKER_HEIGHT = 380;

const EmojiButton = ({ onSelect, className }: EmojiButtonProps) => {
	const handleClick = (emoji: EmojiClickData) => {
		if (onSelect) onSelect(emoji.emoji);
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					size="icon"
					variant="outline"
					className={cn(
						"rounded-full border-transparent text-neutral-500 hover:bg-transparent dark:border-transparent dark:text-neutral-400 dark:hover:bg-transparent",
						className
					)}
				>
					<Smile size={20} />
					<span className="sr-only">Pick Emoji</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent
				side="top"
				sideOffset={24}
				align="start"
				alignOffset={-8}
				className="flex items-center justify-center p-0"
				style={{
					width: `${EMOJI_PICKER_WIDTH + 16}px`,
					height: `${EMOJI_PICKER_HEIGHT + 16}px`,
				}}
			>
				<EmojiPicker
					width={EMOJI_PICKER_WIDTH}
					height={EMOJI_PICKER_HEIGHT}
					className="!border-transparent dark:bg-transparent"
					onEmojiClick={handleClick}
				/>
			</PopoverContent>
		</Popover>
	);
};

export default EmojiButton;
