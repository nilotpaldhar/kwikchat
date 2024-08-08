"use client";

import { Button } from "@/components/ui/button";
import ColorPicker from "@/components/ui/color-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { Pencil } from "lucide-react";

interface BannerSwatchProps {
	bannerColor: string | null;
	disabled?: boolean;
	onChange?: (color: string) => void;
}

const BannerSwatch = ({
	bannerColor,
	disabled = false,
	onChange = () => {},
}: BannerSwatchProps) => {
	if (!bannerColor) return null;

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					disabled={disabled}
					className="relative w-20 h-14 border border-neutral-200 dark:border-neutral-700"
					style={{ backgroundColor: bannerColor }}
				>
					<span className="absolute top-2 right-2 mix-blend-difference">
						<Pencil size={12} />
					</span>
					<span className="sr-only">Change Banner Color</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-60" side="right" sideOffset={8} align="start">
				<div className="relative">
					<ColorPicker color={bannerColor} onChangeComplete={(color) => onChange(color.hex)} />
				</div>
			</PopoverContent>
		</Popover>
	);
};

export default BannerSwatch;
