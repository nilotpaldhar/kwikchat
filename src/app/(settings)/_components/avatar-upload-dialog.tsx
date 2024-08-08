"use client";

import type { Area } from "react-easy-crop";

import { useRef, useState } from "react";
import useMediaQuery from "@/hooks/use-media-query";

import { MAX_AVATAR_SIZE } from "@/constants/media";
import { AVATAR_UPLOAD_MESSAGE as MESSAGE } from "@/constants/user";
import { getCroppedImg, readFile } from "@/lib/crop-image";

import { Loader2, XOctagon } from "lucide-react";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogBody,
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
import { Button } from "@/components/ui/button";
import ImageCropper from "@/components/image-cropper";
import { Alert, AlertTitle } from "@/components/ui/alert";

interface AvatarUploadDialogProps {
	disabled?: boolean;
	onSave?: (image: string) => void;
}

const AvatarUploadDialog = ({ disabled = false, onSave = () => {} }: AvatarUploadDialogProps) => {
	const title = `Edit Image`;
	const description = `Crop your avatar image to resize it for the display space.`;

	// State variables for image cropping and dialog management
	const [image, setImage] = useState("");
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
	const [open, setOpen] = useState(false);
	const [pending, setPending] = useState(false);
	const [error, setError] = useState("");

	// Media query to determine if the screen size is desktop or mobile
	const isDesktop = useMediaQuery("(min-width: 768px)");

	// Reference to the file input element
	const avatarInputRef = useRef<HTMLInputElement | null>(null);

	/**
	 * Resets cropping state to default values.
	 */
	const resetState = () => {
		setImage("");
		setCrop({ x: 0, y: 0 });
		setZoom(1);
	};

	/**
	 * Opens the file input dialog when the button is clicked.
	 */
	const handleButtonClick = () => {
		if (!avatarInputRef.current) return;
		avatarInputRef.current.click();
	};

	/**
	 * Handles file selection, performs validation,
	 * and sets the image to be cropped.
	 */
	const handleFileChange = async (evt: React.ChangeEvent<HTMLInputElement>) => {
		setError("");
		const files = evt.target.files;
		if (!files || files.length <= 0) return;

		const file = files[0];
		if (file.size > MAX_AVATAR_SIZE) setError(MESSAGE.error.maxFileSize);
		const imageDataUrl = await readFile(file);

		if (imageDataUrl && typeof imageDataUrl === "string") {
			setImage(imageDataUrl);
			setOpen(true);

			// Reset file input (incase of selected same image)
			if (avatarInputRef.current) avatarInputRef.current.value = "";
		}
	};

	/**
	 * Handles changes in the dialog's open state.
	 */
	const handleOpenChange = (isOpen: boolean) => {
		if (pending) return;
		if (!isOpen) resetState();
		setOpen(isOpen);
	};

	/**
	 * Closes the dialog and resets the cropping state.
	 */
	const handleClose = () => {
		if (pending) return;
		resetState();
		setOpen(false);
	};

	/**
	 * Saves the cropped image and invokes the `onSave` callback.
	 */
	const handleSave = async () => {
		if (!image || !croppedAreaPixels) return;
		setError("");
		setPending(true);

		try {
			const croppedImage = await getCroppedImg(image, croppedAreaPixels);
			resetState();
			setOpen(false);
			if (croppedImage) onSave(croppedImage);
		} catch (err) {
			setError(MESSAGE.error.unableToSave);
		} finally {
			setPending(false);
		}
	};

	/**
	 * Renders the image cropper component and any error alerts.
	 */
	const renderImageCropper = () => (
		<div className="flex flex-col space-y-5">
			{error && (
				<Alert variant="danger" closable={false}>
					<XOctagon />
					<AlertTitle>{error}</AlertTitle>
				</Alert>
			)}

			<ImageCropper
				image={image}
				crop={crop}
				zoom={zoom}
				onCropChange={setCrop}
				onZoomChange={setZoom}
				onCropComplete={(_, cropPixels) => setCroppedAreaPixels(cropPixels)}
			/>
		</div>
	);

	/**
	 * Renders the save and cancel buttons.
	 */
	const renderSaveAndCancelBtn = () => (
		<>
			<Button
				variant="outline"
				disabled={pending}
				onClick={handleClose}
				className="border-none bg-transparent hover:bg-transparent dark:bg-transparent"
			>
				Cancel
			</Button>
			<Button
				type="submit"
				className="space-x-2"
				disabled={pending || !!error}
				onClick={handleSave}
			>
				{pending && <Loader2 size={18} className="animate-spin" />}
				<span>{pending ? "Saving..." : "Save"}</span>
			</Button>
		</>
	);

	// Render dialog or drawer based on screen size
	return (
		<>
			<Button disabled={disabled} onClick={handleButtonClick}>
				Change Avatar
			</Button>
			<input
				type="file"
				id="avatarInput"
				accept="image/*"
				className="hidden"
				ref={avatarInputRef}
				onChange={handleFileChange}
			/>
			{isDesktop ? (
				<Dialog open={open} onOpenChange={handleOpenChange}>
					<DialogContent>
						<DialogHeader className="text-left">
							<DialogTitle>{title}</DialogTitle>
							<DialogDescription>{description}</DialogDescription>
						</DialogHeader>

						<DialogBody>{renderImageCropper()}</DialogBody>
						<DialogFooter>{renderSaveAndCancelBtn()}</DialogFooter>
					</DialogContent>
				</Dialog>
			) : (
				<Drawer open={open} onOpenChange={handleOpenChange}>
					<DrawerContent>
						<DrawerHeader>
							<DrawerTitle>{title}</DrawerTitle>
							<DrawerDescription>{description}</DrawerDescription>
						</DrawerHeader>
						<DrawerBody>{renderImageCropper()}</DrawerBody>
						<DrawerFooter>{renderSaveAndCancelBtn()}</DrawerFooter>
					</DrawerContent>
				</Drawer>
			)}
		</>
	);
};

export default AvatarUploadDialog;
