"use client";

import Image from "next/image";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

import { CHAT_WELCOME_IMAGE } from "@/constants/media";
import useMessengerDialogStore from "@/store/use-messenger-dialog-store";

const ChatWelcome = () => {
	const onOpen = useMessengerDialogStore().onOpen;

	return (
		<div className="flex h-full flex-col items-center justify-center space-y-10">
			<div className="flex max-w-max items-center justify-center">
				<Image src={CHAT_WELCOME_IMAGE} alt="chat-welcome" width={320} height={320} />
			</div>
			<div className="flex max-w-md flex-col items-center space-y-4 px-5 text-center lg:max-w-lg lg:px-0">
				<h1 className="heading-3 lg:heading-2">Start a Fresh Vibe or Jump Back In!</h1>
				<p className="paragraph text-neutral-700 dark:text-neutral-400">
					Ready for a new chat or to continue from where you left off? Dive into fresh conversations
					or revisit past ones. Let&apos;s keep it fun and funky!
				</p>
				<Button className="space-x-2 px-8" onClick={() => onOpen("NEW_CHAT")}>
					<PlusIcon size={16} />
					<span>Start a New Chat</span>
				</Button>
			</div>
		</div>
	);
};

export default ChatWelcome;
