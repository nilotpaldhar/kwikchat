"use client";

import { useRouter, usePathname } from "next/navigation";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogBody,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerBody,
	DrawerTitle,
	DrawerDescription,
} from "@/components/ui/drawer";
import ChatFriendSelector from "@/components/messenger/chat-friend-selector/index";

import buildOpenChatUrl from "@/utils/messenger/build-open-chat-url";
import useMediaQuery from "@/hooks/use-media-query";
import useMessengerDialogStore from "@/store/use-messenger-dialog-store";

const NewChatDialog = () => {
	const router = useRouter();
	const pathname = usePathname();
	const isDesktop = useMediaQuery("(min-width: 768px)");

	const title = `New Chat`;
	const description = `No Description`;

	// Get dialog state from the store
	const { type, isOpen, onClose } = useMessengerDialogStore();
	const isDialogOpen = isOpen && type === "NEW_CHAT";

	// Handle initiating the chat by navigating to the chat URL
	const handleInitChat = (friendId: string) => {
		const url = buildOpenChatUrl(friendId, pathname);
		onClose();
		router.push(url);
	};

	// Render dialog for desktop
	if (isDesktop) {
		return (
			<Dialog open={isDialogOpen} onOpenChange={onClose}>
				<DialogContent className="outline-none">
					<DialogHeader className="text-left">
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription className="hidden">{description}</DialogDescription>
					</DialogHeader>
					<DialogBody className="!px-0">
						<ChatFriendSelector onSelect={(friendId) => handleInitChat(friendId)} />
					</DialogBody>
				</DialogContent>
			</Dialog>
		);
	}

	// Render drawer for mobile
	return (
		<Drawer
			open={isDialogOpen}
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
		>
			<DrawerContent className="outline-none">
				<DrawerHeader>
					<DrawerTitle>{title}</DrawerTitle>
					<DrawerDescription className="hidden">{description}</DrawerDescription>
				</DrawerHeader>
				<DrawerBody className="!px-0">
					<ChatFriendSelector onSelect={(friendId) => handleInitChat(friendId)} />
				</DrawerBody>
			</DrawerContent>
		</Drawer>
	);
};
export default NewChatDialog;
