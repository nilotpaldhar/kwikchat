"use client";

import type { ImageUpload } from "@/types";

import { Input } from "@/components/ui/input";
import ImageCropper from "@/components/image-cropper";
import Label from "@/components/ui/label";

interface ImageEditorProps {
	selectedImageUpload: ImageUpload | null;
	onUpdate: (image: ImageUpload) => void;
}

const ImageEditor = ({ selectedImageUpload, onUpdate }: ImageEditorProps) => {
	if (!selectedImageUpload) return null;

	return (
		<div className="flex flex-col space-y-5">
			{selectedImageUpload.imageUrl && (
				<ImageCropper
					image={selectedImageUpload.imageUrl}
					crop={selectedImageUpload.crop}
					zoom={selectedImageUpload.zoom}
					cropShape="rect"
					onCropChange={(crop) => onUpdate({ ...selectedImageUpload, crop })}
					onZoomChange={(zoom) => onUpdate({ ...selectedImageUpload, zoom })}
					onCropComplete={(_, croppedAreaPixels) =>
						onUpdate({ ...selectedImageUpload, cropPixels: croppedAreaPixels })
					}
				/>
			)}

			<div className="flex flex-col space-y-1.5">
				<Label htmlFor="caption">Caption</Label>
				<Input
					id="caption"
					type="text"
					placeholder="Add a caption"
					value={selectedImageUpload.caption || ""}
					onChange={(evt) => onUpdate({ ...selectedImageUpload, caption: evt.target.value })}
					className="dark:border-neutral-700 dark:bg-surface-dark-400"
				/>
			</div>
		</div>
	);
};

export default ImageEditor;
