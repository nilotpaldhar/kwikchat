"use client";

import { Camera } from "lucide-react";

import GroupIcon from "@/components/messenger/group-icon";
import CustomFileInput from "@/components/ui/custom-file-input";

interface GroupIconPickerProps {
	src?: string | null;
	fallback?: string;
	size?: number;
	label?: string;
	labelSize?: number;
	iconSize?: number;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const GroupIconPicker = ({
	src = null,
	fallback = "G",
	size = 144,
	label = "Add Group Icon",
	labelSize = 12,
	iconSize = 32,
	onChange = () => {},
}: GroupIconPickerProps) => (
	<CustomFileInput
		accept="image/*"
		onChange={onChange}
		className="rounded-full ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2 dark:ring-offset-surface-dark-600 dark:focus-visible:ring-neutral-600"
	>
		<div className="relative">
			<GroupIcon
				src={src}
				fallback={fallback}
				style={{ width: `${size}px`, height: `${size}px` }}
				wrapperStyle={{ width: `${size}px`, height: `${size}px` }}
			/>

			<div
				className="absolute left-0 top-0 overflow-hidden rounded-full bg-neutral-900/70"
				style={{ width: `${size}px`, height: `${size}px` }}
			>
				<div className="flex h-full w-full flex-col items-center justify-center space-y-1.5 text-neutral-300">
					<Camera size={iconSize} />
					<span
						className="truncate text-center lowercase leading-none"
						style={{ fontSize: `${labelSize}px` }}
					>
						{label}
					</span>
				</div>
			</div>
		</div>
	</CustomFileInput>
);

export default GroupIconPicker;
