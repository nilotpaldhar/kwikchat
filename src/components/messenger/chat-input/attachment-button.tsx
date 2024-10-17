"use client";

import { toast } from "sonner";
import { Plus, File, Image, FileVideo } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

import { cn } from "@/utils/general/cn";

const AttachmentButton = ({ className }: { className?: string }) => {
	const actionBtnClassName =
		"w-full justify-start space-x-2 border-transparent bg-transparent px-1.5 text-left hover:bg-surface-light-300 dark:border-transparent dark:hover:bg-surface-dark-500";

	const handleClick = () => {
		const title = "Coming Soon!";
		const description =
			"This feature isn’t available just yet. We’re working hard to bring it to you soon.";
		toast.info(title, { description, position: "top-right" });
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					size="icon"
					variant="outline"
					className={cn(
						"rounded-full bg-transparent text-neutral-500 dark:bg-transparent dark:text-neutral-400",
						className
					)}
				>
					<Plus size={20} />
					<span className="sr-only">Attachments</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent
				side="top"
				sideOffset={24}
				align="start"
				alignOffset={0}
				className="max-w-48 p-1.5"
			>
				<Button variant="outline" className={actionBtnClassName} onClick={handleClick}>
					<File size={16} />
					<span className="font-semibold">Document</span>
				</Button>
				<Button variant="outline" className={actionBtnClassName} onClick={handleClick}>
					<Image size={16} />
					<span className="font-semibold">Photos</span>
				</Button>
				<Button variant="outline" className={actionBtnClassName} onClick={handleClick}>
					<FileVideo size={16} />
					<span className="font-semibold">Videos</span>
				</Button>
			</PopoverContent>
		</Popover>
	);
};

export default AttachmentButton;
