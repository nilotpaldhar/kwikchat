"use client";

import Slider from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import EasyCropper, { Area, Point } from "react-easy-crop";

import { ImageIcon } from "lucide-react";

interface ImageCropperProps {
	image: string;
	crop?: Point;
	zoom?: number;
	aspect?: number;
	cropShape?: "round" | "rect";
	maxZoom?: number;
	minZoom?: number;
	zoomStep?: number;
	showGrid?: boolean;
	className?: string;
	onCropChange: (location: Point) => void;
	onZoomChange?: (zoom: number) => void;
	onCropComplete?: (croppedArea: Area, croppedAreaPixels: Area) => void;
}

const ImageCropper = ({
	image,
	crop = { x: 0, y: 0 },
	zoom = 1,
	aspect = 1,
	cropShape = "round",
	maxZoom = 3,
	minZoom = 1,
	zoomStep = 0.1,
	showGrid = false,
	className,
	onCropChange,
	onZoomChange = () => {},
	onCropComplete = () => {},
}: ImageCropperProps) => (
	<div className={className}>
		<div className="overflow-hidden rounded-xl bg-black">
			<div className="relative h-[300px] max-h-[400px] min-h-[200px] w-full">
				<EasyCropper
					image={image}
					aspect={aspect}
					crop={crop}
					zoom={zoom}
					cropShape={cropShape}
					showGrid={showGrid}
					onCropChange={onCropChange}
					onZoomChange={onZoomChange}
					onCropComplete={onCropComplete}
					classes={{ cropAreaClassName: "!text-neutral-900/60 !border-white !border-4" }}
				/>
			</div>
		</div>
		<div className="mx-auto mb-5 mt-10 w-[90%]">
			<div className="flex items-center space-x-5">
				<Button
					variant="outline"
					size="icon"
					className="border-none bg-transparent hover:bg-transparent dark:bg-transparent"
					onClick={() => {
						if (zoom > minZoom) onZoomChange(zoom - zoomStep * 2);
					}}
				>
					<ImageIcon size={18} />
				</Button>
				<div className="flex-1">
					<Slider
						value={[zoom]}
						min={minZoom}
						max={maxZoom}
						step={zoomStep}
						onValueChange={(val) => onZoomChange(val[0])}
					/>
				</div>
				<Button
					variant="outline"
					size="icon"
					className="border-none bg-transparent hover:bg-transparent dark:bg-transparent"
					onClick={() => {
						if (zoom < maxZoom) onZoomChange(zoom + zoomStep * 2);
					}}
				>
					<ImageIcon size={32} />
				</Button>
			</div>
		</div>
	</div>
);

export default ImageCropper;
