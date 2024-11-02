"use client";

import { cn } from "@/utils/general/cn";
import { useRef } from "react";

interface CustomFileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	children: React.ReactNode;
	className?: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomFileInput: React.FC<CustomFileInputProps> = ({
	children,
	className,
	onChange,
	...props
}) => {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleClick = () => {
		fileInputRef.current?.click();
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === "Enter") {
			fileInputRef.current?.click();
		}
	};

	return (
		<div
			tabIndex={0}
			role="button"
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			className={cn("block cursor-pointer", className)}
		>
			{children}
			<input type="file" ref={fileInputRef} onChange={onChange} className="hidden" {...props} />
		</div>
	);
};

export default CustomFileInput;
