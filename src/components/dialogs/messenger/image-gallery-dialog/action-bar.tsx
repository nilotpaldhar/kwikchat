"use client";

import { Button } from "@/components/ui/button";
import { Download, Loader2, XIcon } from "lucide-react";

import { cn } from "@/utils/general/cn";

interface ActionBarProps {
	isDownloading?: boolean;
	onDownload?: () => void;
	onClose?: () => void;
	className?: string;
}

const ActionBar = ({ isDownloading, onDownload, onClose, className }: ActionBarProps) => {
	const btnClassNames = `border-transparent text-neutral-700 dark:border-transparent dark:text-neutral-300 dark:bg-surface-dark-400 dark:hover:bg-surface-dark-300`;

	return (
		<div className={cn("border-b border-neutral-200 px-5 py-4 dark:border-neutral-800", className)}>
			<div className="flex w-full items-center justify-end space-x-5">
				<Button
					variant="outline"
					size="icon"
					className={btnClassNames}
					disabled={isDownloading}
					onClick={onDownload}
				>
					{isDownloading ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
					<span className="sr-only">Download</span>
				</Button>
				<Button
					variant="outline"
					size="icon"
					className={btnClassNames}
					disabled={isDownloading}
					onClick={onClose}
				>
					<XIcon size={20} />
					<span className="sr-only">Close</span>
				</Button>
			</div>
		</div>
	);
};

export default ActionBar;
