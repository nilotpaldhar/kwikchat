"use client";

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
import ImageCarousel from "@/components/dialogs/messenger/image-gallery-dialog/image-carousel";

import useMediaQuery from "@/hooks/use-media-query";
import useMessengerDialogStore from "@/store/use-messenger-dialog-store";

const ImageGalleryDialog = () => {
	const title = `No Title`;
	const description = `No Description`;

	const isDesktop = useMediaQuery("(min-width: 768px)");
	const { type, isOpen, onClose, data } = useMessengerDialogStore();

	const isDialogOpen = isOpen && type === "IMAGE_GALLERY";
	const imageMessages = data.imageGallery?.imageMessages ?? [];
	const initialIndex = data.imageGallery?.initialIndex ?? 0;

	// Render dialog for desktop
	if (isDesktop) {
		return (
			<Dialog open={isDialogOpen} onOpenChange={onClose}>
				<DialogContent
					hideClose
					className="outline-none md:max-w-xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-7xl"
				>
					<DialogHeader className="hidden">
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription>{description}</DialogDescription>
					</DialogHeader>
					<DialogBody className="!p-0">
						<ImageCarousel
							imageMessages={imageMessages}
							initialIndex={initialIndex}
							onClose={onClose}
						/>
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
				<DrawerHeader className="hidden">
					<DrawerTitle>{title}</DrawerTitle>
					<DrawerDescription>{description}</DrawerDescription>
				</DrawerHeader>
				<DrawerBody className="!p-0">
					<ImageCarousel
						imageMessages={imageMessages}
						initialIndex={initialIndex}
						onClose={onClose}
					/>
				</DrawerBody>
			</DrawerContent>
		</Drawer>
	);
};

export default ImageGalleryDialog;
