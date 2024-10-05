"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogBody,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerBody,
	DrawerFooter,
	DrawerTitle,
	DrawerDescription,
} from "@/components/ui/drawer";
import ChatInput from "@/components/messenger/chat-input";

import useMediaQuery from "@/hooks/use-media-query";
import useMessengerDialogStore from "@/store/use-messenger-dialog-store";
import { useUpdatePrivateMessage } from "@/hooks/tanstack-query/use-message";

const EditMessageDialog = () => {
	const { mutate } = useUpdatePrivateMessage();
	const isDesktop = useMediaQuery("(min-width: 768px)");

	const title = `Edit Message`;
	const description = `No Description`;

	// Get dialog state from the store
	const { type, isOpen, data, onClose } = useMessengerDialogStore();
	const isDialogOpen = isOpen && type === "EDIT_MESSAGE";
	const message = data.messageToEdit;

	const onSubmit = (updatedMsg: string) => {
		if (!message) return;

		mutate({
			conversationId: message.conversationId,
			messageId: message.messageid,
			message: updatedMsg,
		});
		onClose();
	};

	const renderMessageContent = () => (
		<div className="flex justify-center">
			<div className="flex flex-col space-y-2">
				<div className="max-w-56 rounded-xl rounded-tr-none bg-primary-400 px-4 py-3 text-sm leading-6 text-neutral-50 shadow-md sm:max-w-xs lg:max-w-md xl:max-w-xl 3xl:max-w-3xl">
					{message?.content}
				</div>
				<div className="flex items-center justify-end px-1">
					<span className="block text-xs font-semibold lowercase leading-none text-neutral-500 dark:text-neutral-400">
						{message?.timestamp}
					</span>
				</div>
			</div>
		</div>
	);

	const renderChatInput = () => (
		<ChatInput
			attachment={false}
			emojiPicker={false}
			onSubmit={(updatedMsg) => onSubmit(updatedMsg)}
		/>
	);

	// Render dialog for desktop
	if (isDesktop) {
		return (
			<Dialog open={isDialogOpen} onOpenChange={onClose}>
				<DialogContent className="outline-none">
					<DialogHeader className="text-left">
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription className="hidden">{description}</DialogDescription>
					</DialogHeader>
					<DialogBody className="!py-16">{renderMessageContent()}</DialogBody>
					<DialogFooter>{renderChatInput()}</DialogFooter>
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
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>{title}</DrawerTitle>
					<DrawerDescription className="hidden">{description}</DrawerDescription>
				</DrawerHeader>
				<DrawerBody className="!py-16">{renderMessageContent()}</DrawerBody>
				<DrawerFooter>{renderChatInput()}</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};

export default EditMessageDialog;
