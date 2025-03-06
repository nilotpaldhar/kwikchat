"use client";

import type { ImageUpload } from "@/types";

import useMediaQuery from "@/hooks/use-media-query";

import {
	Dialog,
	DialogBody,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
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
import { ScrollArea } from "@/components/ui/scroll-area";

import ImageEditor from "@/components/messenger/chat-input/image-picker/image-editor";
import ImagePreviewBar from "@/components/messenger/chat-input/image-picker/image-preview-bar";

interface ImageUploadDialogProps {
	open?: boolean;
	imageUploads: ImageUpload[];
	selectedImageUpload: ImageUpload | null;
	supportedImageTypes: string | undefined;
	onOpenChange?: (open: boolean) => void;
	onAppendImage?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onSelectImage?: (image: ImageUpload) => void;
	onRemoveImage?: (image: ImageUpload) => void;
	onUpdateImage?: (image: ImageUpload) => void;
	onSubmit?: () => void;
}

const ImageUploadDialog = ({
	open,
	imageUploads,
	selectedImageUpload,
	supportedImageTypes,
	onOpenChange,
	onAppendImage = () => {},
	onSelectImage = () => {},
	onRemoveImage = () => {},
	onUpdateImage = () => {},
	onSubmit = () => {},
}: ImageUploadDialogProps) => {
	const title = `Send Image(s)`;
	const description = `No Description`;

	const isDesktop = useMediaQuery("(min-width: 768px)");

	const renderContent = () => (
		<ScrollArea className="h-[450px]">
			<div className="px-4 sm:px-5 lg:px-6">
				<div className="flex flex-col space-y-8">
					{selectedImageUpload ? (
						<>
							<ImageEditor selectedImageUpload={selectedImageUpload} onUpdate={onUpdateImage} />
							<ImagePreviewBar
								imageUploads={imageUploads}
								selectedImageUpload={selectedImageUpload}
								onSelect={onSelectImage}
								onRemove={onRemoveImage}
								onAppend={onAppendImage}
								supportedImageTypes={supportedImageTypes}
							/>
						</>
					) : null}
				</div>
			</div>
		</ScrollArea>
	);

	const renderCancelBtn = () => (
		<Button
			variant="outline"
			className="border-none bg-transparent hover:bg-transparent dark:bg-transparent"
		>
			Cancel
		</Button>
	);

	const renderSubmitBtn = () => (
		<Button type="button" onClick={onSubmit}>
			Send
		</Button>
	);

	// Render dialog for desktop
	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="outline-none sm:max-w-lg lg:max-w-xl">
					<DialogHeader className="text-left">
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription className="hidden">{description}</DialogDescription>
					</DialogHeader>
					<DialogBody className="!px-0">{renderContent()}</DialogBody>
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
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>{title}</DrawerTitle>
					<DrawerDescription className="hidden">{description}</DrawerDescription>
				</DrawerHeader>
				<DrawerBody>{renderContent()}</DrawerBody>
				<DrawerFooter>
					<DrawerClose asChild>{renderCancelBtn()}</DrawerClose>
					{renderSubmitBtn()}
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};

export default ImageUploadDialog;
