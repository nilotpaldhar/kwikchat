"use client";

import { useState } from "react";
import { Loader2, XOctagon } from "lucide-react";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogBody,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerBody,
	DrawerFooter,
	DrawerTitle,
	DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle } from "@/components/ui/alert";

import ChatFriendSelector from "@/components/messenger/chat-friend-selector/index";

import useMediaQuery from "@/hooks/use-media-query";
import useMessengerDialogStore from "@/store/use-messenger-dialog-store";
import { useAddGroupMembers } from "@/hooks/tanstack-query/use-group-member";

const AddGroupMembersDialog = () => {
	const title = `Add New Group Members`;
	const description = `No Description`;

	// State hooks for storing selected user IDs and error messages.
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [error, setError] = useState<string>("");

	// Hook to determine if the current device is a desktop.
	const isDesktop = useMediaQuery("(min-width: 768px)");

	// Custom hook to handle the mutation for adding group members.
	const { mutate, isPending, reset } = useAddGroupMembers();

	// Access the state from the messenger dialog store.
	const {
		type,
		data: { conversationToAddMembers },
		isOpen,
		onClose,
	} = useMessengerDialogStore();

	// Check if the dialog is open and if it is specifically for adding new group members.
	const isDialogOpen = isOpen && type === "ADD_NEW_GROUP_MEMBERS";

	/**
	 * Handles member selection and updates the state of selected IDs.
	 */
	const handleMemberSelect = (userId: string, selected: boolean) => {
		reset(); // Reset any existing mutation state.
		setError(""); // Clear any previous errors.
		setSelectedIds((ids) => (selected ? [...ids, userId] : ids.filter((id) => id !== userId)));
	};

	/**
	 * Handles closing the dialog, resetting state if necessary.
	 */
	const handleClose = () => {
		if (isPending) return;
		setSelectedIds([]);
		setError("");
		onClose();
	};

	/**
	 * Handles form submission, including validation and mutation call.
	 */
	const handleSubmit = () => {
		setError(""); // Reset error state before submission.

		const conversationId = conversationToAddMembers?.conversationId;

		// Check if the conversation ID exists.
		if (!conversationId) {
			setError("Internal Error");
			return;
		}

		// Ensure at least one user is selected before proceeding.
		if (selectedIds.length === 0) {
			setError("Please select at least one group member.");
			return;
		}

		// Trigger the mutation to add group members.
		mutate(
			{ conversationId, userIdsToAdd: selectedIds },
			{
				onSuccess: handleClose,
				onError: (err) => setError(err.message),
			}
		);
	};

	/**
	 * Renders the main body of the dialog, including error message and user selection component.
	 */
	const renderBody = () => (
		<>
			{error && (
				<div className="mb-5 flex flex-col space-y-10 px-4 sm:px-5 lg:px-6">
					<Alert variant="danger" closable={false}>
						<XOctagon />
						<AlertTitle>{error}</AlertTitle>
					</Alert>
				</div>
			)}
			<ChatFriendSelector isGroup onSelect={handleMemberSelect} />
		</>
	);

	/**
	 * Renders the cancel button with specific styles and disabled state based on pending requests.
	 */
	const renderCancelBtn = () => (
		<Button
			variant="outline"
			disabled={isPending}
			className="border-none bg-transparent hover:bg-transparent dark:bg-transparent"
		>
			Cancel
		</Button>
	);

	/**
	 * Renders the submit button, including a loading indicator if a request is pending.
	 */
	const renderSubmitBtn = () => (
		<Button className="space-x-2" disabled={isPending} onClick={handleSubmit}>
			{isPending && <Loader2 size={18} className="animate-spin" />}
			<span>{isPending ? "Saving..." : "Done"}</span>
		</Button>
	);

	// Render dialog for desktop view.
	if (isDesktop) {
		return (
			<Dialog open={isDialogOpen} onOpenChange={handleClose}>
				<DialogContent className="outline-none">
					<DialogHeader className="text-left">
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription className="hidden">{description}</DialogDescription>
					</DialogHeader>
					<DialogBody className="!px-0">{renderBody()}</DialogBody>
					<DialogFooter>
						<DialogClose asChild>{renderCancelBtn()}</DialogClose>
						{renderSubmitBtn()}
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	}

	// Render drawer for mobile view.
	return (
		<Drawer
			open={isDialogOpen}
			onOpenChange={(open) => {
				if (!open) handleClose();
			}}
		>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle>{title}</DrawerTitle>
					<DrawerDescription className="hidden">{description}</DrawerDescription>
				</DrawerHeader>
				<DrawerBody className="overflow-hidden !px-0">{renderBody()}</DrawerBody>
				<DrawerFooter>
					<DrawerClose asChild>{renderCancelBtn()}</DrawerClose>
					{renderSubmitBtn()}
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};

export default AddGroupMembersDialog;
