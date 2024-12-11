"use client";

import { useEffect, useState } from "react";

import useMediaQuery from "@/hooks/use-media-query";
import useMessengerDialogStore from "@/store/use-messenger-dialog-store";
import { useUpdateGroupConversationDetails } from "@/hooks/tanstack-query/use-conversation";

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
import ColorPicker from "@/components/ui/color-picker";
import { Alert, AlertTitle } from "@/components/ui/alert";

import { Loader2, XOctagon } from "lucide-react";

const EditGroupBannerDialog = () => {
	const title = `Edit Group Banner`;
	const description = `Update the group's banner color.`;

	// State to manage banner color
	const [bannerColor, setBannerColor] = useState("#27AE80");

	// Hook to manage group conversation update
	const { mutate, isPending, isError, error, reset } = useUpdateGroupConversationDetails();

	// Hook to check if the screen size is desktop
	const isDesktop = useMediaQuery("(min-width: 768px)");

	// State and methods from the dialog/store
	const {
		type,
		isOpen,
		data: { groupConversationToEdit },
		onClose,
	} = useMessengerDialogStore();
	const isDialogOpen = isOpen && type === "EDIT_GROUP_BANNER";

	// Effect to set initial banner color when component mounts
	useEffect(() => {
		if (groupConversationToEdit && groupConversationToEdit.bannerColor) {
			setBannerColor(groupConversationToEdit.bannerColor);
		}
	}, [groupConversationToEdit]);

	// Handle dialog close
	const handleClose = () => {
		if (isPending) return;
		reset();
		onClose();
	};

	// Handle form submission
	const handleSubmit = async () => {
		const conversationId = groupConversationToEdit?.id;
		if (!conversationId) return;
		mutate(
			{
				conversationId,
				groupBannerColor: bannerColor,
			},
			{ onSuccess: handleClose }
		);
	};

	// Render body content for the dialog/drawer
	const renderBodyContent = () => (
		<div className="flex flex-col space-y-5">
			{isError && (
				<Alert variant="danger">
					<XOctagon />
					<AlertTitle>{error.message}</AlertTitle>
				</Alert>
			)}

			<div
				className="h-24 w-full rounded-md border border-neutral-200 dark:border-neutral-700"
				style={{ backgroundColor: bannerColor }}
			/>
			<div className="relative">
				<ColorPicker
					color={bannerColor}
					height={100}
					onChangeComplete={(color) => setBannerColor(color.hex)}
				/>
			</div>
		</div>
	);

	// Render cancel button
	const renderCancelBtn = () => (
		<Button
			variant="outline"
			disabled={isPending}
			className="border-none bg-transparent hover:bg-transparent dark:bg-transparent"
		>
			Cancel
		</Button>
	);

	// Render submit button with loading indicator
	const renderSubmitBtn = () => (
		<Button className="space-x-2" disabled={isPending} onClick={handleSubmit}>
			{isPending && <Loader2 size={18} className="animate-spin" />}
			<span>{isPending ? "Saving..." : "Done"}</span>
		</Button>
	);

	// Render dialog for desktop
	if (isDesktop) {
		return (
			<Dialog open={isDialogOpen} onOpenChange={handleClose}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription>{description}</DialogDescription>
					</DialogHeader>
					<DialogBody>{renderBodyContent()}</DialogBody>
					<DialogFooter>
						<DialogClose asChild>{renderCancelBtn()}</DialogClose>
						{renderSubmitBtn()}
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	}

	// Render drawer for mobile
	return (
		<Drawer
			open={isDialogOpen}
			onOpenChange={(open) => {
				if (!open) handleClose();
			}}
		>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>{title}</DrawerTitle>
					<DrawerDescription>{description}</DrawerDescription>
				</DrawerHeader>

				<DrawerBody>{renderBodyContent()}</DrawerBody>
				<DrawerFooter>
					<DrawerClose asChild>{renderCancelBtn()}</DrawerClose>
					{renderSubmitBtn()}
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};

export default EditGroupBannerDialog;
