"use client";

import type { Area } from "react-easy-crop";

import { useState } from "react";

import ImageCropper from "@/components/image-cropper";

interface GroupIconEditorProps {
	groupIconDataUrl: string;
	onCropComplete: (croppedAreaPixels: Area) => void;
}

const GroupIconEditor = ({ groupIconDataUrl, onCropComplete }: GroupIconEditorProps) => {
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);

	return (
		<div className="px-4 sm:px-5 lg:px-6">
			<ImageCropper
				image={groupIconDataUrl}
				crop={crop}
				zoom={zoom}
				onCropChange={setCrop}
				onZoomChange={setZoom}
				onCropComplete={(_, cropPixels) => onCropComplete(cropPixels)}
			/>
		</div>
	);
};

export default GroupIconEditor;
