"use client";

import type { ImageUpload } from "@/types";

import { Plus } from "lucide-react";

import CustomFileInput from "@/components/ui/custom-file-input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ImageThumbnail from "@/components/messenger/chat-input/image-picker/image-thumbnail";

import { buttonVariants } from "@/components/ui/button";

interface ImagePreviewBarProps {
	imageUploads: ImageUpload[];
	selectedImageUpload: ImageUpload;
	supportedImageTypes: string | undefined;
	onSelect: (image: ImageUpload) => void;
	onRemove: (image: ImageUpload) => void;
	onAppend: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImagePreviewBar = ({
	imageUploads,
	selectedImageUpload,
	supportedImageTypes,
	onSelect,
	onAppend,
	onRemove,
}: ImagePreviewBarProps) => (
	<div className="flex w-full items-center justify-center overflow-hidden">
		<ScrollArea className="max-w-56 py-2 sm:max-w-72 lg:max-w-sm">
			<div className="flex flex-row items-center justify-center gap-1.5 p-1.5">
				{imageUploads.map((imageUpload) => (
					<ImageThumbnail
						key={imageUpload.id}
						imageURL={imageUpload.imageUrl}
						active={imageUpload.id === selectedImageUpload?.id}
						onClick={() => onSelect(imageUpload)}
						onClose={() => onRemove(imageUpload)}
					/>
				))}
			</div>
			<ScrollBar orientation="horizontal" />
		</ScrollArea>

		<div className="py-2">
			<CustomFileInput
				multiple
				accept={supportedImageTypes}
				className={buttonVariants({
					size: "icon",
					variant: "outline",
					className: "size-12 bg-transparent dark:bg-transparent",
				})}
				onChange={onAppend}
			>
				<Plus size={32} />
			</CustomFileInput>
		</div>
	</div>
);

export default ImagePreviewBar;
