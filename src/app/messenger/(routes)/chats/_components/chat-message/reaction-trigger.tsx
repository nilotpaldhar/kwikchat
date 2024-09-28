"use client";

import { Smile } from "lucide-react";

import { Button } from "@/components/ui/button";
import EmojiPicker from "@/components/ui/emoji-picker";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

const ReactionTrigger = () => (
	<Popover>
		<PopoverTrigger asChild>
			<Button
				size="icon"
				variant="outline"
				className="size-6 rounded-full bg-surface-light-100 text-neutral-500 shadow-md dark:bg-neutral-800 dark:text-neutral-400"
			>
				<Smile size={12} />
				<span className="sr-only">Forward Message</span>
			</Button>
		</PopoverTrigger>
		<PopoverContent
			side="top"
			sideOffset={4}
			align="center"
			alignOffset={0}
			className="flex min-h-[50px] w-max min-w-24 items-center justify-center rounded-full p-0 dark:bg-surface-dark-400"
		>
			<EmojiPicker
				reactionsDefaultOpen
				allowExpandReactions={false}
				className="!border-transparent dark:bg-transparent"
				// eslint-disable-next-line no-console
				onReactionClick={(emoji) => console.log(emoji)}
			/>
		</PopoverContent>
	</Popover>
);

export default ReactionTrigger;
